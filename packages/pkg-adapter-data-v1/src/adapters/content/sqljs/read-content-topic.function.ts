import { getEditorialState } from "./get-editorial-state.function";
import { hasContentTable } from "./has-content-table.function";
import { mapTopicDetailsReadModel } from "./map-topic-details-read-model.function";
import { mapTopicLessonReadModel } from "./map-topic-lesson-read-model.function";
import { mapTopicNavigationReadModel } from "./map-topic-navigation-read-model.function";
import { mapTopicResourceReadModel } from "./map-topic-resource-read-model.function";
import { readTopicQuestions } from "./read-topic-questions.function";
import type { ContentDatabase } from "./database/content-database.type";
import type { ContentRow } from "./database/content-row.type";
import type { TopicReadModel } from "@guesant/saberes-application";
import type { TrainingScope } from "@guesant/saberes-domain";

export function readContentTopic(
  db: ContentDatabase,
  slug: string,
  scope?: TrainingScope,
): TopicReadModel | null {
  const row = db.get("SELECT * FROM topics WHERE slug = ?", [slug]);

  if (!row) {
    return null;
  }

  const hasCanonicalModel =
    hasContentTable(db, "canonical_topics") &&
    hasContentTable(db, "canonical_topic_legacy_topics") &&
    hasContentTable(db, "curriculum_topic_canonical_topics");

  const legacyCanonicalIds = hasCanonicalModel
    ? db
      .query("SELECT canonical_topic_id FROM canonical_topic_legacy_topics WHERE topic_id = ?", [
        row.id,
      ])
      .map((item) => {
        return Number(item.canonical_topic_id);
      })
    : [];

  const curriculumCanonicalSlots = legacyCanonicalIds.map(() => {return "?";})
    .join(", ");
  const curriculumTopicIdentity = legacyCanonicalIds.length
    ? `(ct.topic_id = ? OR ctc.canonical_topic_id IN (${curriculumCanonicalSlots}))`
    : "ct.topic_id = ?";

  const curriculumRows =
    scope && hasCanonicalModel
      ? db.query(
        `SELECT DISTINCT ct.id curriculum_topic_id, ct.label, ctc.canonical_topic_id,
        ctc.review_status canonical_mapping_status,
        cts.review_status curriculum_review_status, cts.source_page, cts.source_excerpt,
        sd.id source_id, sd.title source_title, sd.url source_url, sd.is_official
       FROM curriculum_topics ct
       JOIN curriculum_topic_stages cts ON cts.curriculum_topic_id = ct.id
       JOIN stages st ON st.id = cts.stage_id
       JOIN editions e ON e.id = st.edition_id
       LEFT JOIN curriculum_topic_canonical_topics ctc ON ctc.curriculum_topic_id = ct.id
       LEFT JOIN source_documents sd ON sd.id = cts.source_document_id
       WHERE ${curriculumTopicIdentity}
         AND e.slug = ? AND st.slug = ?
       ORDER BY ct.position, ct.id`,
        [row.id, ...legacyCanonicalIds, scope.targetEditionSlug, scope.targetStageSlug],
      )
      : [];

  const canonicalIds = [
    ...new Set([
      ...legacyCanonicalIds,
      ...curriculumRows
        .map((item) => { return Number(item.canonical_topic_id || 0); })
        .filter(Boolean),
    ]),
  ];
  const canonicalSlots = canonicalIds.map(() => {return "?";})
    .join(", ");
  const curriculumTopicIds = [
    ...new Set(curriculumRows.map((item) => { return Number(item.curriculum_topic_id); })),
  ];
  const curriculumTopicSlots = curriculumTopicIds.map(() => {return "?";})
    .join(", ");
  const resourceTopicConditions = [
    "rt.topic_id = ?",
    curriculumTopicIds.length
      ? `rt.curriculum_topic_id IN (${curriculumTopicSlots})`
      : "",
    canonicalIds.length
      ? `rt.topic_id IN (
          SELECT legacy.topic_id FROM canonical_topic_legacy_topics legacy
          WHERE legacy.canonical_topic_id IN (${canonicalSlots})
        )`
      : "",
  ].filter(Boolean).join(" OR ");

  const curriculumReviewStatus = scope
    ? getEditorialState(curriculumRows, "curriculum_review_status")
    : undefined;

  const canonicalMappingStatus = scope
    ? getEditorialState(curriculumRows, "canonical_mapping_status")
    : undefined;

  const sourceIds = [
    ...new Set(
      curriculumRows
        .map((item) => {
          return Number(item.source_id || 0);
        })
        .filter(Boolean),
    ),
  ];

  const sourceTitle =
    String(
      curriculumRows.find((item) => {
        return item.source_title;
      })?.source_title || "",
    ) || undefined;

  const sourceUrl =
    String(
      curriculumRows.find((item) => {
        return item.source_url;
      })?.source_url || "",
    ) || undefined;

  const sourcePage =
    Number(
      curriculumRows.find((item) => {
        return item.source_page;
      })?.source_page || 0,
    ) || undefined;

  const sourceExcerpt =
    String(
      curriculumRows.find((item) => {
        return item.source_excerpt;
      })?.source_excerpt || "",
    ) || undefined;

  const isOfficial = curriculumRows.some((item) => {
    return (
      item.curriculum_review_status === "published" &&
      item.canonical_mapping_status === "published" &&
      Number(item.is_official) === 1
    );
  });

  const historical =
    scope && canonicalIds.length
      ? db.get(
        `SELECT COUNT(DISTINCT q.id) candidate_question_count,
        COUNT(DISTINCT CASE WHEN qct.review_status = 'published'
          AND ctc.review_status = 'published' AND can.status = 'published'
          AND cts.review_status = 'published' THEN q.id END) question_count,
        COUNT(DISTINCT CASE WHEN qct.review_status = 'published'
          AND ctc.review_status = 'published' AND can.status = 'published'
          AND cts.review_status = 'published' THEN qo.id END) occurrence_count
       FROM question_canonical_topics qct
       JOIN canonical_topics can ON can.id = qct.canonical_topic_id
       JOIN curriculum_topic_canonical_topics ctc
         ON ctc.canonical_topic_id = qct.canonical_topic_id
       JOIN curriculum_topic_stages cts ON cts.curriculum_topic_id = ctc.curriculum_topic_id
       JOIN stages target_stage ON target_stage.id = cts.stage_id
       JOIN editions target_edition ON target_edition.id = target_stage.edition_id
       JOIN questions q ON q.id = qct.question_id AND q.status = 'published'
       LEFT JOIN question_occurrences qo ON qo.question_id = q.id AND qo.status = 'published'
       LEFT JOIN papers p ON p.id = qo.paper_id
       LEFT JOIN stages source_stage ON source_stage.id = p.stage_id
       LEFT JOIN editions source_edition ON source_edition.id = source_stage.edition_id
       WHERE qct.canonical_topic_id IN (${canonicalSlots})
         AND target_edition.slug = ? AND target_stage.slug = ?
         AND (? IS NULL OR source_edition.slug = ?)
         AND (? IS NULL OR source_stage.slug = ?)`,
        [
          ...canonicalIds,
          scope.targetEditionSlug,
          scope.targetStageSlug,
          scope.sourceEditionSlug ?? null,
          scope.sourceEditionSlug ?? null,
          scope.sourceStageSlug ?? null,
          scope.sourceStageSlug ?? null,
        ],
      )
      : null;

  let lessons: ContentRow[];

  if (scope && hasCanonicalModel && canonicalIds.length) {
    lessons = db.query(
      `SELECT DISTINCT l.id, l.slug, l.title, l.intro description
       FROM lessons l
       JOIN lesson_topics lt ON lt.lesson_id = l.id
       JOIN curriculum_topics ct ON ct.id = lt.curriculum_topic_id
       JOIN curriculum_topic_canonical_topics ctc ON ctc.curriculum_topic_id = ct.id
       JOIN curriculum_topic_stages cts ON cts.curriculum_topic_id = ct.id
       JOIN stages st ON st.id = cts.stage_id
       JOIN editions e ON e.id = st.edition_id
       WHERE l.is_published = 1 AND ctc.review_status = 'published'
         AND cts.review_status = 'published'
         AND ctc.canonical_topic_id IN (${canonicalSlots})
         AND e.slug = ? AND st.slug = ? ORDER BY l.title`,
      [...canonicalIds, scope.targetEditionSlug, scope.targetStageSlug],
    );
  } else if (scope) {
    lessons = [];
  } else {
    lessons = db.query(
      "SELECT DISTINCT l.id, l.slug, l.title, l.intro description FROM lessons l JOIN lesson_topics lt ON lt.lesson_id = l.id LEFT JOIN curriculum_topics ct ON ct.id = lt.curriculum_topic_id WHERE l.is_published = 1 AND (lt.topic_id = ? OR ct.topic_id = ?) ORDER BY l.title",
      [row.id, row.id],
    );
  }

  let resources: ContentRow[];

  if (
    scope &&
    hasCanonicalModel &&
    (curriculumTopicIds.length || canonicalIds.length) &&
    hasContentTable(db, "resource_targets")
  ) {
    resources = db.query(
      `SELECT DISTINCT r.*, rt.review_status topic_review_status,
        rt.relevance_status topic_relevance_status,
        rt.accessibility_status topic_accessibility_status, rt.review_note topic_review_note,
        sd.reuse_status, sd.license_name, sd.license_url, sd.attribution, sd.rights_note
       FROM resources r
       JOIN resource_topics rt ON rt.resource_id = r.id
       JOIN resource_targets target ON target.resource_id = r.id
       JOIN stages st ON st.id = target.stage_id
       JOIN editions e ON e.id = st.edition_id
       LEFT JOIN source_documents sd ON sd.id = r.source_document_id
       WHERE r.is_published = 1
         AND rt.relevance_status <> 'not_relevant'
         AND (${resourceTopicConditions})
         AND e.slug = ? AND st.slug = ?
       ORDER BY CASE r.availability_mode WHEN 'learning' THEN 0 WHEN 'practice' THEN 1 ELSE 2 END,
         r.title`,
      [
        row.id,
        ...curriculumTopicIds,
        ...canonicalIds,
        scope.targetEditionSlug,
        scope.targetStageSlug,
      ],
    );
  } else if (scope) {
    resources = [];
  } else {
    resources = db.query(
      `SELECT DISTINCT r.*, rt.review_status topic_review_status,
        rt.relevance_status topic_relevance_status,
        rt.accessibility_status topic_accessibility_status, rt.review_note topic_review_note,
        sd.reuse_status, sd.license_name, sd.license_url, sd.attribution, sd.rights_note
       FROM resources r JOIN resource_topics rt ON rt.resource_id = r.id
       LEFT JOIN source_documents sd ON sd.id = r.source_document_id
       WHERE r.is_published = 1 AND rt.relevance_status <> 'not_relevant'
         AND (rt.topic_id = ? OR EXISTS (
         SELECT 1 FROM curriculum_topics ct WHERE ct.id = rt.curriculum_topic_id AND ct.topic_id = ?
       )) ORDER BY r.title`,
      [row.id, row.id],
    );
  }

  const approvedLearningResourceCount = resources.filter((resource) => {
    return (
      resource.availability_mode === "learning" &&
      resource.editorial_status === "published" &&
      resource.topic_review_status === "published" &&
      resource.topic_relevance_status === "relevant" &&
      resource.accessibility_status !== "needs_improvement" &&
      Number(resource.is_free) === 1
    );
  }).length;

  const approvedPracticeResourceCount = resources.filter((resource) => {
    return (
      resource.availability_mode === "practice" &&
      resource.editorial_status === "published" &&
      resource.topic_review_status === "published" &&
      resource.topic_relevance_status === "relevant" &&
      resource.accessibility_status !== "needs_improvement" &&
      Number(resource.is_free) === 1
    );
  }).length;

  const missingRequirements: string[] = [];

  if (scope && curriculumReviewStatus !== "published") {
    missingRequirements.push("curriculum-source-review");
  }

  if (scope && canonicalMappingStatus !== "published") {
    missingRequirements.push("canonical-topic-review");
  }

  if (scope && Number(historical?.question_count || 0) === 0) {
    missingRequirements.push("approved-practice-question");
  }

  if (scope && approvedLearningResourceCount === 0) {
    missingRequirements.push("approved-learning-resource");
  }

  if (scope && approvedPracticeResourceCount === 0) {
    missingRequirements.push("approved-practice-resource");
  }

  return {
    topic: mapTopicDetailsReadModel(row),
    children: db
      .query("SELECT slug, name, description FROM topics WHERE parent_id = ? ORDER BY name", [
        row.id,
      ])
      .map(mapTopicNavigationReadModel),
    lessons: lessons.map(mapTopicLessonReadModel),
    questions: readTopicQuestions(db, Number(row.id), scope),
    prerequisites: db
      .query(
        "SELECT t.slug, t.name, t.description, tr.note FROM topic_relations tr JOIN topics t ON t.id = tr.related_topic_id WHERE tr.topic_id = ? AND tr.relation_type = 'prerequisite' ORDER BY t.name",
        [row.id],
      )
      .map(mapTopicNavigationReadModel),
    related: db
      .query(
        "SELECT t.slug, t.name, t.description, tr.relation_type FROM topic_relations tr JOIN topics t ON t.id = tr.related_topic_id WHERE tr.topic_id = ? ORDER BY t.name",
        [row.id],
      )
      .map(mapTopicNavigationReadModel),
    resources: resources.map(mapTopicResourceReadModel),
    ...(scope
      ? {
        curriculum: {
          targetEditionSlug: scope.targetEditionSlug,
          targetStageSlug: scope.targetStageSlug,
          official: isOfficial,
          reviewStatus: curriculumReviewStatus || "missing",
          canonicalMappingStatus: canonicalMappingStatus || "missing",
          sourceCount: sourceIds.length,
          sourceTitle,
          sourceUrl,
          sourcePage,
          sourceExcerpt,
          candidateQuestionCount: Number(historical?.candidate_question_count || 0),
          historicalQuestionCount: Number(historical?.question_count || 0),
          historicalOccurrenceCount: Number(historical?.occurrence_count || 0),
          learningResourceCount: approvedLearningResourceCount,
          practiceResourceCount: approvedPracticeResourceCount,
          missingRequirements,
        },
      }
      : {}),
  };
}

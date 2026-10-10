import { createTrainingQuestionFilter } from "./create-training-question-filter.function";
import { hasContentTable } from "./has-content-table.function";
import { mapTopicQuestionReadModel } from "./map-topic-question-read-model.function";
import type { ContentDatabase } from "./database/content-database.type";
import type { TopicQuestionReadModel } from "@guesant/saberes-application";
import type { TrainingScope } from "@guesant/saberes-domain";

export function readTopicQuestions(
  db: ContentDatabase,
  topicId: number,
  scope?: TrainingScope,
): TopicQuestionReadModel[] {
  if (!hasContentTable(db, "question_canonical_topics")) {
    return [];
  }

  if (!scope && !hasContentTable(db, "canonical_topic_legacy_topics")) {
    return [];
  }

  const hasEquivalentQuestionRelations = hasContentTable(db, "canonical_question_relations");
  const equivalenceCtes = hasEquivalentQuestionRelations
    ? `equivalent_question_members(question_id, group_id) AS (
        SELECT id, id FROM questions
        UNION
        SELECT CASE WHEN relation.question_id = member.question_id
          THEN relation.related_question_id ELSE relation.question_id END,
          member.group_id
        FROM equivalent_question_members member
        JOIN canonical_question_relations relation
          ON relation.relation_type = 'equivalent'
          AND (relation.question_id = member.question_id OR relation.related_question_id = member.question_id)
      ), canonical_question_identity AS (
        SELECT question_id, MIN(group_id) canonical_question_id
        FROM equivalent_question_members GROUP BY question_id
      ),`
    : "";
  const identityJoin = hasEquivalentQuestionRelations
    ? "JOIN canonical_question_identity identity ON identity.question_id = q.id"
    : "";
  const identityColumn = hasEquivalentQuestionRelations
    ? "identity.canonical_question_id"
    : "q.id";

  const canonicalOccurrences = scope
    ? (() => {
      const filter = createTrainingQuestionFilter(scope, topicId, "qo");

      return db.query(
        `WITH RECURSIVE ${equivalenceCtes} ranked_occurrences AS (
          SELECT qo.id, qo.id occurrence_id, qo.number, q.slug, q.statement, q.difficulty,
            qct.relation_type classification_type, qct.confidence classification_confidence,
            qctsd.title classification_source_title, qctsd.url classification_source_url,
            qct.source_page classification_source_page, qct.source_excerpt classification_source_excerpt,
            e.year source_edition_year, st.name source_stage_name, p.name source_paper_name,
            pv.name source_booklet_name,
            ROW_NUMBER() OVER (
              PARTITION BY ${identityColumn}
              ORDER BY CASE e.year WHEN 2027 THEN 0 WHEN 2026 THEN 1 ELSE 2 END,
                e.year DESC, qo.number, qo.id
            ) occurrence_rank
          FROM question_occurrences qo
          JOIN questions q ON q.id = qo.question_id
          ${identityJoin}
          JOIN question_canonical_topics qct ON qct.question_id = q.id
            AND qct.review_status = 'published'
          LEFT JOIN source_documents qctsd ON qctsd.id = qct.source_document_id
          JOIN papers p ON p.id = qo.paper_id
          JOIN stages st ON st.id = p.stage_id
          JOIN editions e ON e.id = st.edition_id
          LEFT JOIN paper_versions pv ON pv.id = qo.paper_version_id
          WHERE q.status = 'published' AND qo.status = 'published' AND ${filter.sql}
        )
        SELECT id, occurrence_id, number, slug, statement, difficulty,
          classification_type, classification_confidence,
          classification_source_title, classification_source_url,
          classification_source_page, classification_source_excerpt,
          source_edition_year, source_stage_name, source_paper_name, source_booklet_name
        FROM ranked_occurrences WHERE occurrence_rank = 1
        ORDER BY CASE source_edition_year WHEN 2027 THEN 0 WHEN 2026 THEN 1 ELSE 2 END,
          source_edition_year DESC, number, id`,
        filter.params,
      );
    })()
    : db.query(
      `WITH RECURSIVE ${equivalenceCtes} ranked_occurrences AS (
        SELECT qo.id, qo.id occurrence_id, qo.number, q.slug, q.statement, q.difficulty,
          qct.relation_type classification_type, qct.confidence classification_confidence,
          qctsd.title classification_source_title, qctsd.url classification_source_url,
          qct.source_page classification_source_page, qct.source_excerpt classification_source_excerpt,
          e.year source_edition_year, st.name source_stage_name, p.name source_paper_name,
          pv.name source_booklet_name,
          ROW_NUMBER() OVER (PARTITION BY ${identityColumn} ORDER BY e.year DESC, qo.number, qo.id) occurrence_rank
        FROM question_canonical_topics qct
        JOIN canonical_topic_legacy_topics legacy ON legacy.canonical_topic_id = qct.canonical_topic_id
        JOIN question_occurrences qo ON qo.question_id = qct.question_id
        JOIN questions q ON q.id = qo.question_id
        ${identityJoin}
        LEFT JOIN source_documents qctsd ON qctsd.id = qct.source_document_id
        JOIN papers p ON p.id = qo.paper_id
        JOIN stages st ON st.id = p.stage_id
        JOIN editions e ON e.id = st.edition_id
        LEFT JOIN paper_versions pv ON pv.id = qo.paper_version_id
        WHERE qct.review_status = 'published' AND legacy.topic_id = ?
          AND q.status = 'published' AND qo.status = 'published'
      )
      SELECT id, occurrence_id, number, slug, statement, difficulty,
        classification_type, classification_confidence,
        classification_source_title, classification_source_url,
        classification_source_page, classification_source_excerpt,
        source_edition_year, source_stage_name, source_paper_name, source_booklet_name
      FROM ranked_occurrences WHERE occurrence_rank = 1
      ORDER BY source_edition_year DESC, number, id`,
      [topicId],
    );

  const canonicalQuestionsWithoutOccurrences = scope
    ? (() => {
      const filter = createTrainingQuestionFilter(scope, topicId);

      return db.query(
        `WITH RECURSIVE ${equivalenceCtes} ranked_questions AS (
         SELECT q.id, NULL occurrence_id, NULL number, q.slug, q.statement, q.difficulty,
          qct.relation_type classification_type, qct.confidence classification_confidence,
          qctsd.title classification_source_title, qctsd.url classification_source_url,
          qct.source_page classification_source_page, qct.source_excerpt classification_source_excerpt,
          ROW_NUMBER() OVER (PARTITION BY ${identityColumn} ORDER BY q.id) question_rank
         FROM questions q
         ${identityJoin}
         JOIN question_canonical_topics qct ON qct.question_id = q.id
           AND qct.review_status = 'published'
         LEFT JOIN source_documents qctsd ON qctsd.id = qct.source_document_id
         WHERE q.status = 'published'
           AND NOT EXISTS (SELECT 1 FROM question_occurrences qo WHERE qo.question_id = q.id)
           AND ${filter.sql}
        )
        SELECT id, occurrence_id, number, slug, statement, difficulty, classification_type,
          classification_confidence, classification_source_title, classification_source_url,
          classification_source_page, classification_source_excerpt
        FROM ranked_questions WHERE question_rank = 1`,
        filter.params,
      );
    })()
    : db.query(
      `WITH RECURSIVE ${equivalenceCtes} ranked_questions AS (
       SELECT q.id, NULL occurrence_id, NULL number, q.slug, q.statement, q.difficulty,
        qct.relation_type classification_type, qct.confidence classification_confidence,
        qctsd.title classification_source_title, qctsd.url classification_source_url,
        qct.source_page classification_source_page, qct.source_excerpt classification_source_excerpt,
        ROW_NUMBER() OVER (PARTITION BY ${identityColumn} ORDER BY q.id) question_rank
       FROM question_canonical_topics qct
       JOIN canonical_topic_legacy_topics legacy ON legacy.canonical_topic_id = qct.canonical_topic_id
       JOIN questions q ON q.id = qct.question_id
       ${identityJoin}
       LEFT JOIN source_documents qctsd ON qctsd.id = qct.source_document_id
       WHERE qct.review_status = 'published' AND legacy.topic_id = ? AND q.status = 'published'
         AND NOT EXISTS (SELECT 1 FROM question_occurrences qo WHERE qo.question_id = q.id)
      )
      SELECT id, occurrence_id, number, slug, statement, difficulty, classification_type,
        classification_confidence, classification_source_title, classification_source_url,
        classification_source_page, classification_source_excerpt
      FROM ranked_questions WHERE question_rank = 1`,
      [topicId],
    );

  return [...canonicalOccurrences, ...canonicalQuestionsWithoutOccurrences].map(
    mapTopicQuestionReadModel,
  );
}

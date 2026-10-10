import { readContentAssessment } from "./read-content-assessment.function";
import type { ContentDatabase } from "./database/content-database.type";
import type { ContentSnapshotValidationInput } from "@guesant/saberes-application";

export function collectContentSnapshotValidationInput(
  database: ContentDatabase,
): ContentSnapshotValidationInput {
  const tables = database.query(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name",
  );

  const readCount = (sql: string): number => {
    return Number(database.query(sql)[0]?.count || 0);
  };

  const tableNames = tables.map((row) => {return String(row.name || "");});

  const curriculumCoverage = tableNames.includes("curriculum_topic_stages")
    ? database.query(`SELECT st.id, e.slug edition_slug, st.slug stage_slug,
        (SELECT COUNT(DISTINCT cts.curriculum_topic_id) FROM curriculum_topic_stages cts WHERE cts.stage_id = st.id) topic_count,
        (SELECT COUNT(DISTINCT cts.curriculum_topic_id) FROM curriculum_topic_stages cts WHERE cts.stage_id = st.id AND cts.review_status = 'published' AND cts.source_document_id IS NOT NULL) sourced_topic_count,
        (SELECT COUNT(DISTINCT q.id) FROM questions q JOIN canonical_question_topics cqt ON cqt.question_id = q.id JOIN curriculum_topics ct ON ct.topic_id = cqt.topic_id JOIN curriculum_topic_stages cts ON cts.curriculum_topic_id = ct.id AND cts.stage_id = st.id WHERE q.status = 'published' AND cts.review_status = 'published') question_count,
        (SELECT COUNT(DISTINCT q.id) FROM questions q JOIN question_skills qsk ON qsk.question_id = q.id JOIN skills sk ON sk.id = qsk.skill_id AND sk.is_published = 1 JOIN canonical_question_topics cqt ON cqt.question_id = q.id JOIN curriculum_topics ct ON ct.topic_id = cqt.topic_id JOIN curriculum_topic_stages cts ON cts.curriculum_topic_id = ct.id AND cts.stage_id = st.id WHERE q.status = 'published' AND cts.review_status = 'published') skill_tagged_question_count,
        (SELECT COUNT(DISTINCT rt.resource_id) FROM resource_targets rt JOIN resources r ON r.id = rt.resource_id WHERE rt.stage_id = st.id AND r.is_published = 1) resource_count,
        (SELECT COUNT(*) FROM assessment_sets a WHERE a.stage_id = st.id AND a.kind = 'exam' AND a.is_published = 1) published_exam_count
      FROM stages st JOIN editions e ON e.id = st.edition_id ORDER BY e.year DESC, st.name`)
      .map((row) => {
        const exams = database.query("SELECT id FROM assessment_sets WHERE stage_id = ? AND kind = 'exam' AND is_published = 1", [row.id]);

        const readyExamCount = exams.filter((exam) => {return readContentAssessment(database, `assessment:${exam.id}`)?.assessment.canSimulate;}).length;

        return {
          editionSlug: String(row.edition_slug), stageSlug: String(row.stage_slug),
          topicCount: Number(row.topic_count || 0), sourcedTopicCount: Number(row.sourced_topic_count || 0),
          questionCount: Number(row.question_count || 0), skillTaggedQuestionCount: Number(row.skill_tagged_question_count || 0),
          resourceCount: Number(row.resource_count || 0), publishedExamCount: Number(row.published_exam_count || 0), readyExamCount,
        };
      })
    : undefined;

  return {
    tables: tableNames,
    questionCount: readCount("SELECT COUNT(*) count FROM questions WHERE status = 'published'"),
    publishedProcessCount: readCount(
      "SELECT COUNT(*) count FROM admission_processes WHERE is_published = 1",
    ),
    publishedCourseCount: readCount(
      "SELECT COUNT(*) count FROM learning_courses WHERE is_published = 1",
    ),
    assessmentSetCount: readCount(
      "SELECT COUNT(*) count FROM assessment_sets WHERE is_published = 1",
    ),
    orphanOccurrenceCount: readCount(
      "SELECT COUNT(*) count FROM question_occurrences qo LEFT JOIN papers p ON p.id = qo.paper_id WHERE p.id IS NULL",
    ),
    missingOccurrenceKeyCount: readCount(
      "SELECT COUNT(*) count FROM question_occurrences WHERE occurrence_key IS NULL OR occurrence_key = ''",
    ),
    orphanCourseItemCount: readCount(
      "SELECT COUNT(*) count FROM learning_course_items i LEFT JOIN learning_course_modules m ON m.id = i.module_id WHERE m.id IS NULL",
    ),
    orphanPlanStepCount: readCount(
      "SELECT COUNT(*) count FROM study_plan_steps s LEFT JOIN study_plans p ON p.id = s.study_plan_id WHERE p.id IS NULL",
    ),
    invalidBlockCount: readCount(
      "SELECT COUNT(*) count FROM lesson_sections WHERE json_valid(blocks_json) = 0",
    ),
    invalidRoleCount: readCount(
      "SELECT COUNT(*) count FROM lesson_sections WHERE pedagogical_role NOT IN ('context', 'analogy', 'intuition', 'formalization', 'limitation', 'example', 'guided_practice', 'independent_practice', 'application', 'review')",
    ),
    incompleteLessonCount: readCount(
      "SELECT COUNT(*) count FROM lessons l WHERE l.is_published = 1 AND EXISTS (SELECT 1 FROM (SELECT 'context' role UNION ALL SELECT 'analogy' UNION ALL SELECT 'intuition' UNION ALL SELECT 'formalization' UNION ALL SELECT 'limitation' UNION ALL SELECT 'example' UNION ALL SELECT 'guided_practice' UNION ALL SELECT 'independent_practice' UNION ALL SELECT 'application' UNION ALL SELECT 'review') required WHERE NOT EXISTS (SELECT 1 FROM lesson_sections ls WHERE ls.lesson_id = l.id AND ls.pedagogical_role = required.role))",
    ),
    invalidLessonMetadataCount: readCount(
      "SELECT COUNT(*) count FROM lessons WHERE is_published = 1 AND (content_key IS NULL OR content_key = '' OR objective IS NULL OR objective = '' OR audience IS NULL OR audience = '' OR level NOT IN ('basic', 'intermediate', 'advanced', 'all') OR estimated_minutes IS NULL OR estimated_minutes < 1 OR editorial_version IS NULL OR editorial_version = '' OR review_status NOT IN ('draft', 'review', 'published') OR NOT EXISTS (SELECT 1 FROM lesson_sections ls WHERE ls.lesson_id = lessons.id) OR NOT EXISTS (SELECT 1 FROM lesson_sources lsrc WHERE lsrc.lesson_id = lessons.id))",
    ),
    orphanLessonSourceCount: readCount(
      "SELECT COUNT(*) count FROM lesson_sources ls LEFT JOIN lessons l ON l.id = ls.lesson_id LEFT JOIN source_documents sd ON sd.id = ls.source_document_id WHERE l.id IS NULL OR sd.id IS NULL",
    ),
    invalidLessonSectionCount: readCount(
      "SELECT COUNT(*) count FROM lesson_sections WHERE content IS NULL OR TRIM(content) = '' OR content_format NOT IN ('markdown') OR (read_time_minutes IS NOT NULL AND read_time_minutes < 1)",
    ),
    ...(curriculumCoverage ? { curriculumCoverage } : {}),
  };
}

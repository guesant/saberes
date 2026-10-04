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

  return {
    tables: tables.map((row) => {
      return String(row.name || "");
    }),
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
  };
}

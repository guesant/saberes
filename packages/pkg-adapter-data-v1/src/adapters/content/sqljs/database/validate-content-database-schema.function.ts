import type { Database } from "sql.js";

export function validateContentDatabaseSchema(database: Database): void {
  const queries = [
    "SELECT id, version, schema_version, generated_at, notes FROM content_releases LIMIT 0",
    "SELECT id, slug, title, intro, is_published FROM lessons LIMIT 0",
    "SELECT id, lesson_id, type, title, content, position FROM lesson_sections LIMIT 0",
    "SELECT id, slug, title, description, course_type, is_published FROM learning_courses LIMIT 0",
    "SELECT id, learning_course_id, title, position FROM learning_course_modules LIMIT 0",
    "SELECT id, module_id, item_type, lesson_id, question_occurrence_id FROM learning_course_items LIMIT 0",
    "SELECT id, slug, type, statement, status FROM questions LIMIT 0",
    "SELECT id, question_id, paper_id, number FROM question_occurrences LIMIT 0",
  ];

  queries.forEach((query) => {
    database.exec(query);
  });
}

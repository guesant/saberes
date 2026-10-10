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
    "SELECT id, code, name, component_kind FROM exam_components LIMIT 0",
    "SELECT id, course_offering_id, exam_component_id, criterion_kind, priority_order, weight FROM course_exam_criteria LIMIT 0",
    "SELECT id, course_offering_id, threshold_kind, threshold_value FROM course_offering_thresholds LIMIT 0",
    "SELECT id, course_offering_id, allocation_kind, seats FROM course_vacancy_allocations LIMIT 0",
    "SELECT id, editorial_status, editorial_note, availability_mode FROM resources LIMIT 0",
    "SELECT id, reuse_status, license_name, license_url, attribution, rights_note FROM source_documents LIMIT 0",
    "SELECT resource_id, topic_id, curriculum_topic_id, review_status, relevance_status, accessibility_status, review_note FROM resource_topics LIMIT 0",
    "SELECT curriculum_topic_id, stage_id, review_status, source_document_id, source_page, source_excerpt FROM curriculum_topic_stages LIMIT 0",
    "SELECT curriculum_topic_id, canonical_topic_id, relation_type, confidence, review_status FROM curriculum_topic_canonical_topics LIMIT 0",
    "SELECT question_id, canonical_topic_id, relation_type, confidence, source_document_id, source_page, source_excerpt, review_status FROM question_canonical_topics LIMIT 0",
  ];

  queries.forEach((query) => {
    database.exec(query);
  });

  const foreignKeyViolations = database.exec("PRAGMA foreign_key_check")[0]?.values ?? [];

  if (foreignKeyViolations.length > 0) {
    const [table, rowId, parent, foreignKeyIndex] = foreignKeyViolations[0] ?? [];

    throw new Error(
      `Content database has ${foreignKeyViolations.length} foreign-key violation(s); first: ${String(table)} row ${String(rowId)} references ${String(parent)} (constraint ${String(foreignKeyIndex)}).`,
    );
  }
}

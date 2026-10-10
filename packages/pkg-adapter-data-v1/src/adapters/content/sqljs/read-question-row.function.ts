import { createTrainingQuestionFilter } from "./create-training-question-filter.function";
import { getContentIdentifier } from "./get-content-identifier.function";
import { hasContentTable } from "./has-content-table.function";
import type { ContentDatabase } from "./database/content-database.type";
import type { ContentRow } from "./database/content-row.type";
import type { TrainingScope } from "@guesant/saberes-domain";

export function readQuestionRow(db: ContentDatabase, key: string, scope?: TrainingScope): ContentRow | null {
  if (scope && !hasContentTable(db, "curriculum_topic_stages")) {return null;}

  const identifier = getContentIdentifier(key);

  const filter = scope ? createTrainingQuestionFilter(scope, undefined, key.startsWith("exercise:") ? undefined : "qo") : null;

  if (key.startsWith("exercise:")) {
    return db.get(`SELECT id question_id, slug question_slug, type, statement, explanation, difficulty, image_path, editorial_version, status editorial_status FROM questions q WHERE slug = ?${filter ? ` AND q.status = 'published' AND ${filter.sql}` : ""}`, [identifier, ...(filter?.params ?? [])]);
  }

  return db.get(`SELECT qo.id occurrence_id, qo.occurrence_key, q.id question_id, q.slug question_slug, q.type, q.statement, q.explanation, q.difficulty, q.image_path, q.editorial_version, q.status editorial_status, qo.status occurrence_status, qo.number, e.year, e.slug source_edition_slug, st.slug source_stage_slug, ap.name process_name, s.name subject FROM question_occurrences qo JOIN questions q ON q.id = qo.question_id JOIN papers p ON p.id = qo.paper_id JOIN stages st ON st.id = p.stage_id JOIN editions e ON e.id = st.edition_id JOIN admission_processes ap ON ap.id = e.admission_process_id LEFT JOIN subjects s ON s.id = qo.subject_id WHERE (qo.id = ? OR qo.occurrence_key = ? OR qo.occurrence_key = ?)${filter ? ` AND q.status = 'published' AND qo.status = 'published' AND ${filter.sql}` : ""}`, [Number(identifier) || 0, key, identifier, ...(filter?.params ?? [])]);
}

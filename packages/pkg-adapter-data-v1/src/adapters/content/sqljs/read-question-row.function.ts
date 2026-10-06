import { getContentIdentifier } from "./get-content-identifier.function";
import type { ContentDatabase } from "./database/content-database.type";
import type { ContentRow } from "./database/content-row.type";

export function readQuestionRow(db: ContentDatabase, key: string): ContentRow | null {
  const identifier = getContentIdentifier(key);

  if (key.startsWith("exercise:")) {
    return db.get("SELECT id question_id, slug question_slug, type, statement, explanation, difficulty, image_path FROM questions WHERE slug = ? AND status = 'published'", [identifier]);
  }

  return db.get("SELECT qo.id occurrence_id, qo.occurrence_key, q.id question_id, q.slug question_slug, q.type, q.statement, q.explanation, q.difficulty, q.image_path, qo.number, e.year, ap.name process_name, s.name subject FROM question_occurrences qo JOIN questions q ON q.id = qo.question_id JOIN papers p ON p.id = qo.paper_id JOIN stages st ON st.id = p.stage_id JOIN editions e ON e.id = st.edition_id JOIN admission_processes ap ON ap.id = e.admission_process_id LEFT JOIN subjects s ON s.id = qo.subject_id WHERE (qo.id = ? OR qo.occurrence_key = ? OR qo.occurrence_key = ?) AND q.status = 'published'", [Number(identifier) || 0, key, identifier]);
}

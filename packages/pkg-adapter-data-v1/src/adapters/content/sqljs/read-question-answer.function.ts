import { hasContentTable } from "./has-content-table.function";
import type { ContentDatabase } from "./database/content-database.type";
import type { ContentRow } from "./database/content-row.type";

export function readQuestionAnswer(db: ContentDatabase, question: ContentRow): ContentRow {
  if (hasContentTable(db, "canonical_answer_keys")) {
    const canonical = db.get(
      "SELECT ak.id, ak.occurrence_id, ak.status, ak.answer_value correct_answer, ak.is_automatically_gradable FROM canonical_answer_keys ak WHERE ak.question_id = ? AND ak.question_part_id IS NULL AND (ak.occurrence_id = ? OR ak.occurrence_id IS NULL) ORDER BY CASE WHEN ak.occurrence_id = ? THEN 0 ELSE 1 END, ak.version DESC LIMIT 1",
      [question.question_id, question.occurrence_id || 0, question.occurrence_id || 0],
    );

    if (canonical) {
      if (canonical.status === "cancelled") {
        return {};
      }

      const optionAnswer = db.get(
        "SELECT GROUP_CONCAT(opt.code, ',') correct_answer FROM canonical_answer_key_options ako JOIN question_options opt ON opt.id = ako.question_option_id WHERE ako.answer_key_id = ?",
        [canonical.id],
      );

      const correctAnswer = String(canonical.correct_answer || optionAnswer?.correct_answer || "");

      return {
        correct_answer: correctAnswer,
        is_automatically_gradable: canonical.status === "definitive" && Number(canonical.is_automatically_gradable) === 1 && Boolean(correctAnswer),
      };
    }
  }

  if (question.occurrence_id) {
    return db.get("SELECT answer_value correct_answer, is_automatically_gradable FROM answer_keys WHERE question_occurrence_id = ? AND question_part_id IS NULL ORDER BY id DESC LIMIT 1", [question.occurrence_id]) || {};
  }

  if (hasContentTable(db, "canonical_answer_keys")) {
    return db.get("SELECT answer_value correct_answer, is_automatically_gradable FROM canonical_answer_keys WHERE question_id = ? ORDER BY id DESC LIMIT 1", [question.question_id]) || {};
  }

  return {};
}

import { hasContentTable } from "./has-content-table.function";
import { mapQuestionOptionReadModel } from "./map-question-option-read-model.function";
import type { ContentDatabase } from "./database/content-database.type";
import type { ContentRow } from "./database/content-row.type";
import type { QuestionOptionReadModel } from "@guesant/saberes-application";

export function readQuestionOptions(db: ContentDatabase, question: ContentRow): QuestionOptionReadModel[] {
  let rows = db.query("SELECT * FROM question_options WHERE question_id = ? ORDER BY position", [question.question_id]);

  if (question.occurrence_id && hasContentTable(db, "question_occurrence_options")) {
    rows = db.query("SELECT opt.*, map.code display_code, map.position display_position FROM question_options opt LEFT JOIN question_occurrence_options map ON map.question_option_id = opt.id AND map.occurrence_id = ? WHERE opt.question_id = ? ORDER BY COALESCE(map.position, opt.position)", [question.occurrence_id, question.question_id]);
  }

  return rows.map(mapQuestionOptionReadModel);
}

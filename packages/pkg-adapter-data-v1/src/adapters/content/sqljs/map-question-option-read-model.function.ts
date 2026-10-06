import type { ContentRow } from "./database/content-row.type";
import type { QuestionOptionReadModel } from "@guesant/saberes-application";

export function mapQuestionOptionReadModel(row: ContentRow): QuestionOptionReadModel {
  return {
    id: Number(row.id),
    code: String(row.display_code || row.code),
    canonicalCode: String(row.code),
    text: String(row.text || ""),
    position: Number(row.display_position || row.position),
  };
}

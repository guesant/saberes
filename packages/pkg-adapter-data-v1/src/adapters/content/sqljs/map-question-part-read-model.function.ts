import type { ContentRow } from "./database/content-row.type";
import type { QuestionPartReadModel } from "@guesant/saberes-application";

export function mapQuestionPartReadModel(row: ContentRow): QuestionPartReadModel {
  return {
    id: Number(row.id),
    code: String(row.code || ""),
    label: String(row.label || ""),
    prompt: String(row.prompt || ""),
    type: String(row.type || ""),
    position: Number(row.position),
  };
}

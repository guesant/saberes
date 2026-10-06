import type { ContentRow } from "./database/content-row.type";
import type { QuestionDetailsReadModel } from "@guesant/saberes-application";

export function mapQuestionDetailsReadModel(row: ContentRow): QuestionDetailsReadModel {
  return {
    occurrence_id: Number(row.occurrence_id) || null,
    occurrence_key: String(row.occurrence_key || ""),
    question_id: Number(row.question_id || row.id),
    question_slug: String(row.question_slug || row.slug || ""),
    canonical_key: `exercise:${String(row.question_slug || row.slug || "")}`,
    type: String(row.type || ""),
    statement: String(row.statement || ""),
    explanation: String(row.explanation || ""),
    difficulty: String(row.difficulty || ""),
    number: Number(row.number) || null,
    year: Number(row.year) || null,
    process_name: String(row.process_name || ""),
    subject: String(row.subject || ""),
    image_path: String(row.image_path || ""),
    correct_answer: String(row.correct_answer || ""),
    is_automatically_gradable: Number(row.is_automatically_gradable) === 1,
  };
}

import type { ContentRow } from "./database/content-row.type";
import type { QuestionDetailsReadModel } from "@guesant/saberes-application";

export function mapQuestionDetailsReadModel(row: ContentRow): QuestionDetailsReadModel {
  return {
    training_eligible: getQuestionTrainingEligible(row),
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
    answer_status: row.answer_status === "cancelled" || row.answer_status === "provisional" || row.answer_status === "definitive"
      ? row.answer_status
      : undefined,
    editorial_status: typeof row.editorial_status === "string" ? row.editorial_status : undefined,
    occurrence_status: typeof row.occurrence_status === "string" ? row.occurrence_status : undefined,
    editorial_version: String(row.editorial_version || ""),
    answer_key_version: row.answer_key_version == null ? undefined : String(row.answer_key_version),
    source_edition_slug: String(row.source_edition_slug || ""),
    source_stage_slug: String(row.source_stage_slug || ""),
    target_edition_slug: String(row.target_edition_slug || ""),
    target_stage_slug: String(row.target_stage_slug || ""),
  };
}
import { getQuestionTrainingEligible } from "./get-question-training-eligible.function";

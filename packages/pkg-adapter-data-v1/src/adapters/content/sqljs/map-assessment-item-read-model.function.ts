import type { ContentRow } from "./database/content-row.type";
import type { AssessmentItemReadModel } from "@guesant/saberes-application";

export function mapAssessmentItemReadModel(row: ContentRow): AssessmentItemReadModel {
  const occurrenceId = Number(row.question_occurrence_id) || null;

  const questionSlug = String(row.question_slug || "");

  const questionKey = occurrenceId ? `question:${occurrenceId}` : `exercise:${questionSlug}`;

  return {
    position: Number(row.position),
    item_type: String(row.item_type || "question"),
    question_occurrence_id: occurrenceId,
    question_id: Number(row.question_id) || null,
    question_slug: questionSlug,
    lesson_id: Number(row.lesson_id) || null,
    questionKey: row.lesson_id ? "" : questionKey,
    href: occurrenceId ? `/questoes/${occurrenceId}` : `/exercicios/${questionSlug}`,
    max_points: Number(row.points ?? 1),
    title: String(row.title || row.statement || ""),
    description: String(row.description || ""),
  };
}

import type { QuestionReadModel } from "@guesant/saberes-application";

export function getQuestionContentKey(
  data: QuestionReadModel | null,
  fallback: string | undefined,
): string {
  const occurrenceId = data?.question.occurrence_id;

  return occurrenceId ? `question:${String(occurrenceId)}` : String(fallback || "");
}

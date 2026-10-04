import type { Attempt, CatalogCard } from "@guesant/saberes-application";

export function getQuestionAttempt(
  question: CatalogCard,
  attempts: Attempt[],
): Attempt | undefined {
  return attempts
    .filter((attempt) => String(attempt.questionId) === String(question.id))
    .sort((left, right) =>
      String(right.answeredAt || "").localeCompare(String(left.answeredAt || "")),
    )[0];
}

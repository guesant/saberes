import type { Attempt } from "@guesant/saberes-application";

export function getAssessmentQuestionAttempts(
  attempts: Attempt[],
  questionIds: Set<string>,
): Attempt[] {
  return attempts.filter((attempt) => questionIds.has(String(attempt.questionId)));
}

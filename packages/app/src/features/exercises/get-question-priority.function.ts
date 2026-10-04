import type { Attempt } from "@guesant/saberes-application";

export function getQuestionPriority(attempt: Attempt | undefined): number {
  if (!attempt) {
    return 0;
  }

  return attempt.isCorrect === false ? 1 : 2;
}

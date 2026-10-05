import type { Attempt } from "@guesant/saberes-application";

export function getPersonalProgressAttemptKey(attempt: Attempt): string | undefined {
  if (attempt.contentKey) {
    return attempt.contentKey;
  }

  if (attempt.questionId !== undefined) {
    return `question:${String(attempt.questionId)}`;
  }

  return undefined;
}

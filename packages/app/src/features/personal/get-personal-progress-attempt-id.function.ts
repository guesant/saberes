import type { Attempt } from "@guesant/saberes-application";

export function getPersonalProgressAttemptId(attempt: Attempt, attemptIndex: number): string {
  return attempt.id ?? `attempt:${String(attemptIndex)}`;
}

import type { Attempt } from "@guesant/saberes-application";

export function getPerformanceAccuracy(attempts: Attempt[]): number {
  const corrected = attempts.filter((attempt) => attempt.isCorrect !== null);

  if (!corrected.length) {
    return 0;
  }

  return (
    (corrected.filter((attempt) => attempt.isCorrect === true).length / corrected.length) * 100
  );
}

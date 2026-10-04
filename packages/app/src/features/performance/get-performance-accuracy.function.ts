import type { Attempt } from "@guesant/saberes-application";

export function getPerformanceAccuracy(attempts: Attempt[]): number {
  const corrected = attempts.filter((attempt) => {
    return attempt.isCorrect !== null;
  });

  if (!corrected.length) {
    return 0;
  }

  return (
    (corrected.filter((attempt) => {
      return attempt.isCorrect === true;
    }).length /
      corrected.length) *
    100
  );
}

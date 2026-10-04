import type { PerformanceDiagnosisStat } from "./performance-diagnosis-stat.interface";
import type { Attempt, DiagnosisCode } from "@guesant/saberes-application";

export function getPerformanceDiagnosisStats(attempts: Attempt[]): PerformanceDiagnosisStat[] {
  const counts = new Map<DiagnosisCode, number>();

  for (const attempt of attempts) {
    if (attempt.diagnosis) {
      counts.set(attempt.diagnosis, (counts.get(attempt.diagnosis) || 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([code, count]) => ({ attempts: count, code }))
    .sort((left, right) => right.attempts - left.attempts);
}

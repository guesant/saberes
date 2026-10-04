import type { GetPerformanceDiagnosisStatsInput } from "./get-performance-diagnosis-stats-input.interface";
import type { PerformanceDiagnosisStat } from "./performance-diagnosis-stat.interface";
import type { DiagnosisCode } from "@guesant/saberes-application";

export function getPerformanceDiagnosisStats(
  input: GetPerformanceDiagnosisStatsInput,
): PerformanceDiagnosisStat[] {
  const counts = new Map<DiagnosisCode, number>();

  for (const attempt of input.attempts) {
    if (attempt.diagnosis) {
      counts.set(attempt.diagnosis, (counts.get(attempt.diagnosis) || 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([code, count]) => ({
      action: input.actionForDiagnosis(code),
      attempts: count,
      code,
    }))
    .sort((left, right) => right.attempts - left.attempts);
}

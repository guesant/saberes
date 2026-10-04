import { getPerformanceDiagnosisStat } from "./get-performance-diagnosis-stat.function";
import type { GetPerformanceDiagnosisStatsInput } from "./get-performance-diagnosis-stats-input.interface";
import type { PerformanceDiagnosisStat } from "./performance-diagnosis-stat.interface";
import type { DiagnosisCode } from "@guesant/saberes-application";

export function getPerformanceDiagnosisStats(
  input: GetPerformanceDiagnosisStatsInput,
): PerformanceDiagnosisStat[] {
  const counts = new Map<DiagnosisCode, number>();

  const attemptsByCode = new Map<DiagnosisCode, typeof input.attempts>();

  for (const attempt of input.attempts) {
    if (attempt.diagnosis) {
      counts.set(attempt.diagnosis, (counts.get(attempt.diagnosis) || 0) + 1);

      attemptsByCode.set(attempt.diagnosis, [
        ...(attemptsByCode.get(attempt.diagnosis) || []),
        attempt,
      ]);
    }
  }

  return [...counts.entries()]
    .map(([code, count]) => {
      return getPerformanceDiagnosisStat({
        actionForDiagnosis: input.actionForDiagnosis,
        attempts: attemptsByCode.get(code) || [],
        code,
        count,
        now: input.now,
      });
    })
    .sort((left, right) => {
      return right.attempts - left.attempts;
    });
}

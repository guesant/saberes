import type { PerformanceConfidenceBand } from "./performance-confidence-band.type";

export function getPerformanceConfidenceBand(
  correctedAttemptCount: number,
): PerformanceConfidenceBand {
  if (correctedAttemptCount >= 8) {
    return "high";
  }

  if (correctedAttemptCount >= 3) {
    return "medium";
  }

  return "low";
}

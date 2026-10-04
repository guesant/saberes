import type { Attempt } from "@guesant/saberes-application";

export interface PerformanceAttemptMetrics {
  correctedAttempts: Attempt[];
  correctAttempts: Attempt[];
  elapsedAttempts: Attempt[];
  elapsedMs: number;
  recentAttempts: Attempt[];
}

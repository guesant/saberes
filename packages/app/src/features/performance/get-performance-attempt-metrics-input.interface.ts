import type { Attempt } from "@guesant/saberes-application";

export interface GetPerformanceAttemptMetricsInput {
  attempts: Attempt[];
  now: Date;
}

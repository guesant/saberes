import type { GetPerformanceFilteredDataInput } from "./get-performance-filtered-data-input.interface";
import type { Attempt, StudySession } from "@guesant/saberes-application";

export interface GetPerformanceScopedAttemptsInput {
  attempts: Attempt[];
  sessions: StudySession[];
  filter: GetPerformanceFilteredDataInput["filter"];
  now: Date;
}

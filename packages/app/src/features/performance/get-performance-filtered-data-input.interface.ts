import type { PerformanceFilter } from "./performance-filter.interface";
import type { Attempt, StudySession } from "@guesant/saberes-application";

export interface GetPerformanceFilteredDataInput {
  attempts: Attempt[];
  filter: PerformanceFilter;
  now: Date;
  sessions: StudySession[];
}

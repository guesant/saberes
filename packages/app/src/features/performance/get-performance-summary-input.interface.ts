import type { PerformanceFilter } from "./performance-filter.interface";
import type { Attempt, StudyRecord, StudySession } from "@guesant/saberes-application";

export interface GetPerformanceSummaryInput {
  attempts: Attempt[];
  sessions: StudySession[];
  topicMastery: StudyRecord[];
  now: Date;
  filter?: PerformanceFilter;
}

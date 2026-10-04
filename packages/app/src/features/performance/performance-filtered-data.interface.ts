import type { Attempt, StudySession } from "@guesant/saberes-application";

export interface PerformanceFilteredData {
  attempts: Attempt[];
  sessions: StudySession[];
}

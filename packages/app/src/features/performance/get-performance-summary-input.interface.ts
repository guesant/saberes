import type { Attempt, StudySession } from "@guesant/saberes-application";

export interface GetPerformanceSummaryInput {
  attempts: Attempt[];
  sessions: StudySession[];
  now: Date;
}

import type { Attempt, StudyRecord, StudySession } from "@guesant/saberes-application";

export interface GetPerformanceSummaryInput {
  attempts: Attempt[];
  sessions: StudySession[];
  topicMastery: StudyRecord[];
  now: Date;
}

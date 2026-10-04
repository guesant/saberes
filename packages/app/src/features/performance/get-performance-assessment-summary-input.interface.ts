import type { Attempt, StudySession } from "@guesant/saberes-application";

export interface GetPerformanceAssessmentSummaryInput {
  attempts: Attempt[];
  sessions: StudySession[];
}

import type { StudySession } from "@guesant/saberes-application";

export interface PerformanceSessionMetrics {
  completedSessions: StudySession[];
  studyMs: number;
}

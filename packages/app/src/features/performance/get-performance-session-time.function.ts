import type { StudySession } from "@guesant/saberes-application";

export function getPerformanceSessionTime(session: StudySession): string | undefined {
  return session.completedAt || session.startedAt;
}

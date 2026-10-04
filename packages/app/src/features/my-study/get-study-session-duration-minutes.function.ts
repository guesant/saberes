import type { StudySession } from "@guesant/saberes-application";

export function getStudySessionDurationMinutes(session: StudySession): number {
  return Math.max(1, Math.round(Number(session.durationMs || 0) / 60000));
}

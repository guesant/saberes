import type { StudySession } from "@guesant/saberes-application";

export function isQuestionStudySessionPaused(session: StudySession | null): boolean {
  return session?.status === "paused";
}

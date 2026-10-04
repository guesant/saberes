import type { StudySession } from "@guesant/saberes-application";

export function isQuestionStudySessionCompleted(session: StudySession | null): boolean {
  return session?.status === "completed" || !session?.questionKeys?.length;
}

import type { StudySession } from "@guesant/saberes-application";

export function getQuestionSessionAnsweredCount(session: StudySession): number {
  return session.answeredQuestionKeys?.length ?? 0;
}

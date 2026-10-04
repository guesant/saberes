import type { StudySession } from "@guesant/saberes-application";

export function getQuestionSessionCorrectCount(session: StudySession): number {
  return session.correctAnswers ?? 0;
}

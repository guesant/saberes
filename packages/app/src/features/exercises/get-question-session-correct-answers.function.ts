import type { StudySession } from "@guesant/saberes-application";

export function getQuestionSessionCorrectAnswers(
  session: StudySession,
  correct: boolean | null,
): number {
  return (session.correctAnswers ?? 0) + Number(correct === true);
}

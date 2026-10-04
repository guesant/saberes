import type { StudySession } from "@guesant/saberes-application";

export function getQuestionSessionAnsweredKeys(
  session: StudySession,
  questionKey: string,
): string[] {
  return [
    ...(session.answeredQuestionKeys ?? []).filter(
      (answeredQuestionKey) => answeredQuestionKey !== questionKey,
    ),
    questionKey,
  ];
}

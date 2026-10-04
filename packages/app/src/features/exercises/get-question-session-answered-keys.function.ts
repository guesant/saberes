import type { StudySession } from "@guesant/saberes-application";

export function getQuestionSessionAnsweredKeys(
  session: StudySession,
  questionKey: string,
): string[] {
  return [
    ...(session.answeredQuestionKeys ?? []).filter((answeredQuestionKey) => {
      return answeredQuestionKey !== questionKey;
    }),
    questionKey,
  ];
}

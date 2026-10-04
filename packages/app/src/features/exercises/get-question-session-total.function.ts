import type { StudySession } from "@guesant/saberes-application";

export function getQuestionSessionTotal(session: StudySession): number {
  return session.questionKeys?.length ?? 0;
}

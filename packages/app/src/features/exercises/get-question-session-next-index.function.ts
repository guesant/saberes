import { getQuestionSessionCurrentIndex } from "./get-question-session-current-index.function";
import type { StudySession } from "@guesant/saberes-application";

export function getQuestionSessionNextIndex(session: StudySession): number {
  const questionCount = session.questionKeys?.length ?? 0;

  const nextIndex = getQuestionSessionCurrentIndex(session) + 1;

  return Math.min(nextIndex, questionCount);
}

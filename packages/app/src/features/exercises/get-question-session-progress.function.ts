import { getQuestionSessionAnsweredCount } from "./get-question-session-answered-count.function";
import { getQuestionSessionCorrectCount } from "./get-question-session-correct-count.function";
import { getQuestionSessionPercentage } from "./get-question-session-percentage.function";
import { getQuestionSessionTotal } from "./get-question-session-total.function";
import type { StudySession } from "@guesant/saberes-application";

export interface QuestionSessionProgress {
  answered: number;
  correct: number;
  total: number;
  percentage: number;
}

export function getQuestionSessionProgress(session: StudySession): QuestionSessionProgress {
  const total = getQuestionSessionTotal(session);

  const answered = getQuestionSessionAnsweredCount(session);

  const correct = getQuestionSessionCorrectCount(session);

  return {
    answered,
    correct,
    total,
    percentage: getQuestionSessionPercentage({ answered, total }),
  };
}

import { getQuestionSessionAnsweredKeys } from "./get-question-session-answered-keys.function";
import { getQuestionSessionCorrectAnswers } from "./get-question-session-correct-answers.function";
import { getQuestionSessionNextIndex } from "./get-question-session-next-index.function";
import { getQuestionSessionSkippedKeys } from "./get-question-session-skipped-keys.function";
import type { StudySession } from "@guesant/saberes-application";

export interface UpdateQuestionStudySessionInput {
  session: StudySession;
  questionKey: string;
  correct: boolean | null;
  completedAt: string;
  skipped?: boolean;
}

export function updateQuestionStudySession(input: UpdateQuestionStudySessionInput): StudySession {
  const questionCount = input.session.questionKeys?.length ?? 0;

  const currentIndex = getQuestionSessionNextIndex(input.session);

  const completed = currentIndex >= questionCount;

  return {
    ...input.session,
    currentIndex,
    answeredQuestionKeys: getQuestionSessionAnsweredKeys(input.session, input.questionKey),
    skippedQuestionKeys: getQuestionSessionSkippedKeys({
      questionKey: input.questionKey,
      session: input.session,
      skipped: input.skipped,
    }),
    correctAnswers: getQuestionSessionCorrectAnswers(input.session, input.correct),
    status: completed ? "completed" : "active",
    completedAt: completed ? input.completedAt : input.session.completedAt,
  };
}

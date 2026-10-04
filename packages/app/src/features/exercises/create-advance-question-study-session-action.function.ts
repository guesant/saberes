import { updateQuestionStudySession } from "./update-question-study-session.function";
import type { SaveQuestionStudySessionAction } from "./create-save-question-study-session-action.function";
import type { QuestionSubmissionResult } from "./question-submission-result.interface";
import type { AsyncAction } from "../../types/async-action.type";
import type { StudySession } from "@guesant/saberes-application";

export interface AdvanceQuestionStudySessionInput {
  questionKey: string;
  result: QuestionSubmissionResult;
  session: StudySession;
}

export function createAdvanceQuestionStudySessionAction(
  saveSession: SaveQuestionStudySessionAction,
): AsyncAction<[AdvanceQuestionStudySessionInput], void> {
  return (input: AdvanceQuestionStudySessionInput): Promise<void> => {
    return saveSession(
      updateQuestionStudySession({
        completedAt: new Date()
          .toISOString(),
        correct: input.result.correct,
        questionKey: input.questionKey,
        session: input.session,
      }),
    );
  };
}

import { updateQuestionStudySession } from "./update-question-study-session.function";
import type { SaveQuestionStudySessionAction } from "./create-save-question-study-session-action.function";
import type { AsyncAction } from "../../types/async-action.type";
import type { StudySession } from "@guesant/saberes-application";

export interface SkipQuestionStudySessionInput {
  questionKey: string;
  session: StudySession;
}

export function createSkipQuestionStudySessionAction(
  saveSession: SaveQuestionStudySessionAction,
): AsyncAction<[SkipQuestionStudySessionInput], void> {
  return (input: SkipQuestionStudySessionInput): Promise<void> =>
    saveSession(
      updateQuestionStudySession({
        completedAt: new Date().toISOString(),
        correct: null,
        questionKey: input.questionKey,
        session: input.session,
        skipped: true,
      }),
    );
}

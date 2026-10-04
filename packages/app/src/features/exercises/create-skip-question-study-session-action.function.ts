import { updateQuestionStudySession } from "./update-question-study-session.function";
import type { SaveQuestionStudySessionAction } from "./create-save-question-study-session-action.function";
import type { StudySession } from "@guesant/saberes-application";

export interface SkipQuestionStudySessionInput {
  questionKey: string;
  session: StudySession;
}

export function createSkipQuestionStudySessionAction(
  saveSession: SaveQuestionStudySessionAction,
): (input: SkipQuestionStudySessionInput) => Promise<void> {
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

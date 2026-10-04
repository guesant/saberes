import type { SaveQuestionStudySessionAction } from "./create-save-question-study-session-action.function";
import type { AsyncAction } from "../../types/async-action.type";
import type { StudySession } from "@guesant/saberes-application";

export function createCompleteQuestionStudySessionAction(
  saveSession: SaveQuestionStudySessionAction,
): AsyncAction<[StudySession], void> {
  return (session: StudySession): Promise<void> => {
    return saveSession({
      ...session,
      completedAt: new Date()
        .toISOString(),
      status: "completed",
    });
  };
}

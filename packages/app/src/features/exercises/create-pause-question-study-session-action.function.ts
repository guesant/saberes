import type { SaveQuestionStudySessionAction } from "./create-save-question-study-session-action.function";
import type { StudySession } from "@guesant/saberes-application";

export function createPauseQuestionStudySessionAction(
  saveSession: SaveQuestionStudySessionAction,
): (session: StudySession) => Promise<void> {
  return (session: StudySession): Promise<void> => saveSession({ ...session, status: "paused" });
}

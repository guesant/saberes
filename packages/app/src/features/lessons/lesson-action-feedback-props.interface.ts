import type { ActionState } from "../../types/action-state.type";

export interface LessonActionFeedbackProps {
  bookmarkError: Error | null;
  bookmarkState: ActionState;
  progressError: Error | null;
  progressState: ActionState;
}

import type { ActionState } from "../../types/action-state.type";

export interface LessonProgressViewModel {
  bookmarkActionError: Error | null;
  bookmarkActionState: ActionState;
  bookmarked: boolean;
  completed: boolean;
  progressActionError: Error | null;
  progressActionState: ActionState;
  progressError: Error | null;
  sectionIndex: number | undefined;
}

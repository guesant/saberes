import type { ActionState } from "../../types/action-state.type";

export interface LessonBookmarkActionState {
  error: Error | null;
  save(): Promise<void>;
  state: ActionState;
}

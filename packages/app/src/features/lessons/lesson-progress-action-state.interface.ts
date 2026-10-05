import type { ActionState } from "../../types/action-state.type";

export interface LessonProgressActionState {
  error: Error | null;
  save(completed: boolean): Promise<void>;
  state: ActionState;
}

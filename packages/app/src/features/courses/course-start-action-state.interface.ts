import type { ActionState } from "../../types/action-state.type";

export interface CourseStartActionState {
  error: Error | null;
  start(): Promise<void>;
  state: ActionState;
}

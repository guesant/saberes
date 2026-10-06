import type { ActionState } from "../../types/action-state.type";

export interface CourseEnrollmentAction {
  error: Error | null;
  start(): Promise<void>;
  state: ActionState;
}

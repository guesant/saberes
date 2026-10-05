import type { ActionState } from "../../types/action-state.type";

export interface CourseStartActionProps {
  onStart(): Promise<void>;
  startError: Error | null;
  startState: ActionState;
  started: boolean;
}

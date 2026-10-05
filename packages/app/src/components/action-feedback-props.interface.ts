import type { ActionState } from "../types/action-state.type";

export interface ActionFeedbackProps {
  error: Error | null;
  state: ActionState;
}

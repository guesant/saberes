import type { ActionState } from "../types/action-state.type";

export interface ActionFeedbackDescriptor {
  messageKey:
    "common.cancelled" | "common.removed" | "common.saveError" | "common.saved" | "common.saving";
  severity: "error" | "info" | "success";
  state: ActionState;
}

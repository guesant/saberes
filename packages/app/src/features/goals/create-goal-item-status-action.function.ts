import type { CreateGoalItemStatusActionInput } from "./create-goal-item-status-action-input.interface";
import type { GoalItemStatusButtonProps } from "./goal-item-status-button-props.interface";

export function createGoalItemStatusAction(
  input: CreateGoalItemStatusActionInput,
): GoalItemStatusButtonProps {
  return { disabled: input.hidden, ...input };
}

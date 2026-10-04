import { UIContentGroup } from "@guesant/saberes-ui";
import { createGoalItemStatusActions } from "./create-goal-item-status-actions.function";
import { GoalItemStatusButton } from "./goal-item-status-button.component";
import type { GoalItemStatusActionsContentProps } from "./goal-item-status-actions-content-props.interface";

export function GoalItemStatusActionsContent(props: GoalItemStatusActionsContentProps) {
  const actions = createGoalItemStatusActions(props.value);

  return (
    <UIContentGroup variant="inline">
      {actions.map((action) => {
        return (
          <GoalItemStatusButton
            disabled={action.disabled}
            hidden={action.hidden}
            key={action.label}
            label={action.label}
            onClick={action.onClick}
          />
        );
      })}
    </UIContentGroup>
  );
}

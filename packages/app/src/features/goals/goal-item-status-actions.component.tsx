import { GoalItemStatusActionsContent } from "./goal-item-status-actions-content.component";
import type { GoalItemStatusActionsProps } from "./goal-item-status-actions-props.interface";

export function GoalItemStatusActions(props: GoalItemStatusActionsProps) {
  return <GoalItemStatusActionsContent value={props} />;
}

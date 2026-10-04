import { UIButton } from "@guesant/saberes-ui";
import type { GoalItemStatusButtonProps } from "./goal-item-status-button-props.interface";

export function GoalItemStatusButton(props: GoalItemStatusButtonProps) {
  return (
    <UIButton
      disabled={props.disabled}
      hidden={props.hidden}
      onClick={props.onClick}
      variant="text"
    >
      {props.label}
    </UIButton>
  );
}

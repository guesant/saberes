import { UIButton } from "@guesant/saberes-ui";
import type { StudyCaptureActionButtonProps } from "./study-capture-action-button-props.interface";

export function StudyCaptureActionButton(props: StudyCaptureActionButtonProps) {
  return (
    <UIButton href={props.href} iconOnly={false} variant={props.variant}>
      {props.label}
    </UIButton>
  );
}

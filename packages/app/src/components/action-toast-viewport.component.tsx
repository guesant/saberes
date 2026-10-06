import { UIToast } from "@guesant/saberes-ui";
import { getActionToastDuration } from "./get-action-toast-duration.function";
import type { ActionToastViewportProps } from "./action-toast-viewport-props.interface";

export function ActionToastViewport(props: ActionToastViewportProps) {
  if (!props.toast) {
    return null;
  }

  return (
    <UIToast
      autoHideDuration={getActionToastDuration(props.toast)}
      key={props.toast.id}
      onClose={props.onDismiss}
      open
      severity={props.toast.severity}
    >
      {props.toast.message}
    </UIToast>
  );
}

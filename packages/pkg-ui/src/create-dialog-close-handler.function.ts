import type { DialogCloseHandler } from "./dialog-close-handler.interface";
import type { UIDialogProps } from "./dialog-props.interface";

export function createDialogCloseHandler(
  onClose: UIDialogProps["onClose"],
): DialogCloseHandler {
  return (_event, reason) => {
    if (reason !== "backdropClick") {
      onClose();
    }
  };
}

import { hasButtonAccessibleLabel } from "./has-button-accessible-label.function";
import type { UIButtonProps } from "./button.component";

export function isButtonIconOnly(props: UIButtonProps, label: string): boolean {
  if (props.iconOnly !== undefined) {
    return props.iconOnly;
  }

  if (!hasButtonAccessibleLabel(props, label)) {
    return false;
  }

  return true;
}

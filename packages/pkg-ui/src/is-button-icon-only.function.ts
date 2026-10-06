import { hasButtonAccessibleLabel } from "./has-button-accessible-label.function";
import { isButtonPrimaryVariant } from "./is-button-primary-variant.function";
import type { UIButtonProps } from "./button.component";

export function isButtonIconOnly(props: UIButtonProps, label: string): boolean {
  if (props.iconOnly !== undefined) {
    return props.iconOnly;
  }

  if (isButtonPrimaryVariant(props.variant) || props.fullWidth) {
    return false;
  }

  if (!hasButtonAccessibleLabel(props, label)) {
    return false;
  }

  return true;
}

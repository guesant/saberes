import { getButtonIconShape } from "./get-button-icon-shape.function";
import { getButtonLabel } from "./get-button-label.function";
import { isButtonIconOnly } from "./is-button-icon-only.function";
import type { UIButtonProps } from "./button.component";

export function getButtonPresentation(props: UIButtonProps) {
  const label = getButtonLabel(props.children);

  const iconOnly = isButtonIconOnly(props, label);

  const accessibleLabel = props["aria-label"] || label || props.title || "";

  let ariaLabel = props["aria-label"];

  let {title} = props;

  if (iconOnly) {
    ariaLabel = accessibleLabel;

    title = accessibleLabel;
  }

  return {
    accessibleLabel,
    ariaLabel,
    iconOnly,
    iconShape: getButtonIconShape(props, iconOnly),
    label,
    title,
  };
}

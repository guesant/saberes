import type { UIButtonProps } from "./button.component";

export function getButtonIconShape(
  props: UIButtonProps,
  iconOnly: boolean,
): "round" | "square" | undefined {
  if (!iconOnly) {
    return undefined;
  }

  return props.iconShape ?? "square";
}

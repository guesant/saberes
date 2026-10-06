import type { UIButtonProps } from "./button.component";

export function hasButtonAccessibleLabel(props: UIButtonProps, label: string): boolean {
  return Boolean(props["aria-label"] || props.title || label);
}

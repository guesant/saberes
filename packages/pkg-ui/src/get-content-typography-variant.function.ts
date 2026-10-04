import type { UIContentTextProps } from "./content-text-props.interface";

export function getContentTypographyVariant(
  variant: UIContentTextProps["variant"],
): "body1" | "caption" | "h6" {
  if (variant === "caption") {
    return "caption";
  }

  if (variant === "heading") {
    return "h6";
  }

  return "body1";
}

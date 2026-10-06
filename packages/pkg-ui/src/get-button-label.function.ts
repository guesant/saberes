import { Children, isValidElement } from "react";
import type { ReactNode } from "react";

interface ButtonChildProps {
  children?: ReactNode;
}

export function getButtonLabel(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }

      if (isValidElement<ButtonChildProps>(child)) {
        return getButtonLabel(child.props.children);
      }

      return "";
    })
    .filter(Boolean)
    .join(" ")
    .trim();
}

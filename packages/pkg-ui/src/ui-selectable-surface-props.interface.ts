import type { ComponentPropsWithoutRef, ReactNode } from "react";

export interface UISelectableSurfaceProps extends Pick<
  ComponentPropsWithoutRef<"button">,
  "aria-current" | "aria-label" | "aria-pressed" | "disabled" | "id" | "onClick" | "onKeyDown"
> {
  children?: ReactNode;
  interactive?: boolean;
  selected: boolean;
}

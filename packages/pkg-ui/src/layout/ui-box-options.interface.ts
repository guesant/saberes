import type { UiBoxAlignment } from "./ui-box-alignment.type";
import type { UiBoxLayout } from "./ui-box-layout.type";
import type { UiSpacingToken } from "./ui-spacing-token.type";
import type { ElementType, ReactNode } from "react";

export interface UiBoxOptions<Component extends ElementType> {
  align?: UiBoxAlignment;
  columns?: 2 | 3 | 4;
  children?: ReactNode;
  component?: Component;
  gap?: UiSpacingToken;
  inset?: UiSpacingToken;
  layout?: UiBoxLayout;
  minItemWidth?: "compact" | "comfortable";
  wrap?: boolean;
}

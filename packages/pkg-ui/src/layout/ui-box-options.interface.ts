import type { UiBoxAlignment } from "./ui-box-alignment.type";
import type { UiBoxLayout } from "./ui-box-layout.type";
import type { UiSpacingToken } from "./ui-spacing-token.type";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ElementType, ReactNode } from "react";

export interface UiBoxOptions<Component extends ElementType> {
  align?: UiBoxAlignment;
  columns?: 2 | 3 | 4;
  children?: ReactNode;
  className?: string;
  component?: Component;
  disabled?: boolean;
  gap?: UiSpacingToken;
  inset?: UiSpacingToken;
  layout?: UiBoxLayout;
  minItemWidth?: "compact" | "comfortable";
  sx?: SxProps<Theme>;
  type?: string;
  wrap?: boolean;
}

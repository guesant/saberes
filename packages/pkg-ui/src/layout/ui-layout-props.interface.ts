import type { UiSpacingToken } from "./ui-spacing-token.type";
import type { ElementType, ReactNode } from "react";

export interface UILayoutProps {
  align?: "center" | "end" | "start" | "stretch";
  children: ReactNode;
  component?: ElementType;
  gap?: UiSpacingToken;
  inset?: UiSpacingToken;
}

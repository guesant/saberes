import type { UiSpacingToken } from "./ui-spacing-token.type";
import type { ReactNode } from "react";

export interface UILayoutProps {
  "aria-label"?: string;
  role?: string;
  align?: "center" | "end" | "start" | "stretch";
  children: ReactNode;
  gap?: UiSpacingToken;
  inset?: UiSpacingToken;
}

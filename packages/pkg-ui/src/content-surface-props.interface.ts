import type { ReactNode } from "react";

export interface UIContentSurfaceProps {
  ariaLabel?: string;
  children: ReactNode;
  component?: "div" | "section";
  mode: "outlined" | "scrolling" | "summary" | "text-summary";
}

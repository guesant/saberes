import type { ReactNode } from "react";

export interface UIContentSurfaceProps {
  ariaLabel?: string;
  children: ReactNode;
  mode: "outlined" | "scrolling" | "summary" | "text-summary";
}

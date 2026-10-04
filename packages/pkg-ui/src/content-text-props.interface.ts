import type { ReactNode } from "react";

export interface UIContentTextProps {
  children: ReactNode;
  component?: "h3" | "p" | "pre";
  preserveWhitespace?: boolean;
  variant: "body" | "caption" | "heading" | "title";
}

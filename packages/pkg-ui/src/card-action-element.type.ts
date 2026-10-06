import type { MouseEventHandler, ReactElement, ReactNode } from "react";

export type CardActionElement = ReactElement<{
  "aria-label": string;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
}>;

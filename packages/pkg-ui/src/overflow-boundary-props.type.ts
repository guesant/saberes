import type { ReactNode } from "react";

export type UIOverflowBoundaryProps = {
  children: ReactNode;
  mode: "scroll-x" | "scroll-y" | "clip";
};

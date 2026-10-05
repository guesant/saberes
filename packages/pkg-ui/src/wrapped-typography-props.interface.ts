import type { TypographyProps } from "@mui/material";
import type { ReactNode } from "react";

export interface UIWrappedTypographyProps {
  children: ReactNode;
  color?: TypographyProps["color"];
  variant?: TypographyProps["variant"];
}

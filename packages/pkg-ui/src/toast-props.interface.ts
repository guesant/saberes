import type { AlertColor } from "@mui/material";
import type { ReactNode } from "react";

export interface UIToastProps {
  autoHideDuration?: number | null;
  children: ReactNode;
  onClose(): void;
  open: boolean;
  severity: AlertColor;
}

import type { ReactNode } from "react";

export interface UIContentAlertProps {
  children: ReactNode;
  role?: "alert" | "status";
  severity: "error" | "info" | "success" | "warning";
}

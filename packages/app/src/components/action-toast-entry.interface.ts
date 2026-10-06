import type { ActionToastSeverity } from "./action-toast-severity.type";
import type { ReactNode } from "react";

export interface ActionToastEntry {
  id: number;
  message: ReactNode;
  severity: ActionToastSeverity;
}

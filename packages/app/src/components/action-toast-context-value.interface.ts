import type { ActionToastSeverity } from "./action-toast-severity.type";
import type { ReactNode } from "react";

export interface ActionToastContextValue {
  enqueue(message: ReactNode, severity: ActionToastSeverity): void;
}

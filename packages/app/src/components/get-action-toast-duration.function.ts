import type { ActionToastEntry } from "./action-toast-entry.interface";

export function getActionToastDuration(toast: ActionToastEntry): number {
  if (toast.severity === "error") {
    return 8000;
  }

  return 3500;
}

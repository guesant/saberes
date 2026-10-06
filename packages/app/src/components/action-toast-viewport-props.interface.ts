import type { ActionToastEntry } from "./action-toast-entry.interface";

export interface ActionToastViewportProps {
  onDismiss(): void;
  toast: ActionToastEntry | null;
}

import type { ReactNode } from "react";

export interface UIDialogProps {
  children: ReactNode;
  actions?: ReactNode;
  cancelLabel?: string;
  confirmLabel?: string;
  closeLabel?: string;
  onConfirm?(): void;
  onClose(): void;
  open: boolean;
  title: string;
}

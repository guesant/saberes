import type { ReactNode } from "react";

export interface UIDialogProps {
  children: ReactNode;
  actions?: ReactNode;
  cancelLabel?: string;
  closeLabel?: string;
  onClose(): void;
  open: boolean;
  title: string;
}

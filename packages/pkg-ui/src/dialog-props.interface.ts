import type { ReactNode } from "react";

export interface UIDialogProps {
  children: ReactNode;
  onClose(): void;
  open: boolean;
  title: string;
}

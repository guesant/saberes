import type { FormEvent, ReactNode } from "react";

export interface UIFormProps {
  children: ReactNode;
  id?: string;
  onSubmit(event: FormEvent<HTMLFormElement>): void;
}

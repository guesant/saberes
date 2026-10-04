import type { FormEvent, ReactNode } from "react";

export interface UIFormProps {
  children: ReactNode;
  onSubmit(event: FormEvent<HTMLFormElement>): void;
}

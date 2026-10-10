import type { UiSelectFieldOption } from "./ui-select-field-option.interface";

export interface UiSelectFieldProps {
  label: string;
  onChange(value: string): void;
  options: UiSelectFieldOption[];
  value: string;
}

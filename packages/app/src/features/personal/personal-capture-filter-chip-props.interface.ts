import type { PersonalCaptureFilter } from "./personal-capture-filter.type";

export interface PersonalCaptureFilterChipProps {
  filter: PersonalCaptureFilter;
  selected: boolean;
  label: string;
  onChange(value: PersonalCaptureFilter): void;
}

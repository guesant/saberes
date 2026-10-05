import type { PersonalCaptureFilter } from "./personal-capture-filter.type";

export interface PersonalCaptureFilterControlsProps {
  value: PersonalCaptureFilter;
  onChange(value: PersonalCaptureFilter): void;
}

import type { CalendarEntryFormInput } from "./calendar-entry-form-input.interface";

export interface CalendarEntryFormProps {
  initialValue?: CalendarEntryFormInput;
  onSave(input: CalendarEntryFormInput): Promise<void>;
  submitLabel: string;
  title: string;
}

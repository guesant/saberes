import type { CalendarEntryFormInput } from "./calendar-entry-form-input.interface";

export interface CalendarEntryFormProps {
  dialogTitle: string;
  initialValue?: CalendarEntryFormInput;
  onClose(): void;
  onSave(input: CalendarEntryFormInput): Promise<void>;
  open: boolean;
  submitLabel: string;
  title: string;
}

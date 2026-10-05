import type { CalendarEntryFormInput } from "./calendar-entry-form-input.interface";

export interface CalendarEntryFormProps {
  onCreate(input: CalendarEntryFormInput): Promise<void>;
}

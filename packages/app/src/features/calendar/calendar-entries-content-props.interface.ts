import type { CalendarEntryFormInput } from "./calendar-entry-form-input.interface";
import type { CalendarEntry } from "@guesant/saberes-application";

export interface CalendarEntriesContentProps {
  entries: CalendarEntry[];

  onDelete(id: string): Promise<void>;

  onSave(entryId: string, input: CalendarEntryFormInput): Promise<void>;
}

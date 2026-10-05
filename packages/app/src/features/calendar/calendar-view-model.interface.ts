import type { CalendarEntryFormInput } from "./calendar-entry-form-input.interface";
import type { CalendarEntry, CalendarView } from "@guesant/saberes-application";

export interface CalendarViewModel {
  state: "loading" | "error" | "ready";
  entries: CalendarEntry[];
  view: CalendarView;
  anchorDate: string;
  error: Error | null;
  setView(view: CalendarView): void;

  setAnchorDate(anchorDate: string): void;

  createEntry(input: CalendarEntryFormInput): Promise<void>;

  reload(): Promise<void>;
}

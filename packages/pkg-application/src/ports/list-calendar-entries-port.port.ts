import type { ListCalendarEntriesQueryInput } from "../models/list-calendar-entries-query-input.interface";
import type { CalendarEntry } from "@guesant/saberes-domain";

export interface ListCalendarEntriesPort {
  execute(input: ListCalendarEntriesQueryInput): Promise<CalendarEntry[]>;
}

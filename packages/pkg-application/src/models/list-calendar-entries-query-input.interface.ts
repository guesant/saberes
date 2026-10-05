import type { CalendarView } from "@guesant/saberes-domain";

export interface ListCalendarEntriesQueryInput {
  view: CalendarView;
  anchorDate: string;
}

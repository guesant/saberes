import { isWithinInterval, parseISO } from "date-fns";
import { getCalendarPeriodRange } from "./get-calendar-period-range.function";
import type { ListCalendarEntriesInput } from "./list-calendar-entries-input.interface";
import type { CalendarEntry } from "../models/calendar-entry.interface";

export function listCalendarEntries(input: ListCalendarEntriesInput): CalendarEntry[] {
  const range = getCalendarPeriodRange(input);

  const interval = { end: parseISO(range.endsAt), start: parseISO(range.startsAt) };

  return (input.workspace.calendarEntries ?? [])
    .filter((entry) => { return entry.status !== "archived"; })
    .filter((entry) => { return isWithinInterval(parseISO(entry.startsAt), interval); })
    .sort((left, right) => { return left.startsAt.localeCompare(right.startsAt); });
}

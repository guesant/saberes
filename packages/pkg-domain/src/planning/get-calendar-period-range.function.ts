import {
  endOfMonth,
  endOfWeek,
  endOfDay,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import type { CalendarPeriodRange } from "./calendar-period-range.interface";
import type { GetCalendarPeriodRangeInput } from "./get-calendar-period-range-input.interface";

export function getCalendarPeriodRange(
  input: GetCalendarPeriodRangeInput,
): CalendarPeriodRange {
  const anchorDate = parseISO(input.anchorDate);

  let startsAt = anchorDate;

  let endsAt = anchorDate;

  if (input.view === "month") {
    startsAt = startOfMonth(anchorDate);

    endsAt = endOfMonth(anchorDate);
  }

  if (input.view === "week") {
    startsAt = startOfWeek(anchorDate, { weekStartsOn: 1 });

    endsAt = endOfWeek(anchorDate, { weekStartsOn: 1 });
  }

  if (input.view === "list") {
    startsAt = startOfDay(anchorDate);

    endsAt = endOfDay(anchorDate);
  }

  return { endsAt: endsAt.toISOString(), startsAt: startsAt.toISOString() };
}

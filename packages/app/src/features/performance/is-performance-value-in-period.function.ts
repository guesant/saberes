import { differenceInCalendarDays, parseISO } from "date-fns";

export function isPerformanceValueInPeriod(
  value: string | undefined,
  periodDays: number | null,
  now: Date,
): boolean {
  if (!value || periodDays === null) {
    return true;
  }

  return differenceInCalendarDays(now, parseISO(value)) < periodDays;
}

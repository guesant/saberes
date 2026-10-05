import type { CalendarView } from "../models/calendar-view.type";

export interface GetCalendarPeriodRangeInput {
  view: CalendarView;
  anchorDate: string;
}

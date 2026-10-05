import type { CalendarView } from "@guesant/saberes-application";

export interface CalendarViewSelectorProps {
  view: CalendarView;
  onViewChange(view: CalendarView): void;
}

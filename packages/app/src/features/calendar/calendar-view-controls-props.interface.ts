import type { CalendarView } from "@guesant/saberes-application";

export interface CalendarViewControlsProps {
  anchorDate: string;
  view: CalendarView;
  onAnchorDateChange(anchorDate: string): void;

  onViewChange(view: CalendarView): void;
}

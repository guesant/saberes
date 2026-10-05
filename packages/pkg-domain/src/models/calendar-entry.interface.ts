import type { CalendarEntryStatus } from "./calendar-entry-status.type";

export interface CalendarEntry {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt?: string;
  status: CalendarEntryStatus;
  sourceCaptureId?: string;
  createdAt: string;
  updatedAt: string;
}

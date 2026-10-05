export interface CreateCalendarEntryCommandInput {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt?: string;
  sourceCaptureId?: string;
  now: string;
}

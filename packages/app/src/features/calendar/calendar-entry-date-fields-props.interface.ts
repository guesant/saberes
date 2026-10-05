export interface CalendarEntryDateFieldsProps {
  startsAt: string;
  endsAt: string;
  onStartsAtChange(value: string): void;

  onEndsAtChange(value: string): void;
}

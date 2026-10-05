export interface CalendarEntryFormFieldsProps {
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  onTitleChange(value: string): void;

  onDescriptionChange(value: string): void;

  onStartsAtChange(value: string): void;

  onEndsAtChange(value: string): void;
}

export interface CalendarEntryFormState {
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  setTitle(value: string): void;

  setDescription(value: string): void;

  setStartsAt(value: string): void;

  setEndsAt(value: string): void;

  create(): Promise<void>;
}

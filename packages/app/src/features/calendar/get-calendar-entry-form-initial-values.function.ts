import type { CalendarEntryFormInput } from "./calendar-entry-form-input.interface";

export function getCalendarEntryFormInitialValues(
  initialValue?: CalendarEntryFormInput,
): CalendarEntryFormInput {
  return initialValue ?? {
    description: "",
    endsAt: "",
    startsAt: "",
    title: "",
  };
}

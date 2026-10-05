import { useState } from "react";
import { getCalendarEntryFormInitialValues } from "./get-calendar-entry-form-initial-values.function";
import type { CalendarEntryFormInput } from "./calendar-entry-form-input.interface";
import type { CalendarEntryFormProps } from "./calendar-entry-form-props.interface";
import type { CalendarEntryFormState } from "./calendar-entry-form-state.interface";

export function useCalendarEntryFormState(props: CalendarEntryFormProps): CalendarEntryFormState {
  const initialValue = getCalendarEntryFormInitialValues(props.initialValue);

  const [title, setTitle] = useState(initialValue.title);

  const [description, setDescription] = useState(initialValue.description);

  const [startsAt, setStartsAt] = useState(initialValue.startsAt);

  const [endsAt, setEndsAt] = useState(initialValue.endsAt);

  const create = async (): Promise<void> => {
    const input: CalendarEntryFormInput = {
      description: description.trim(),
      endsAt,
      startsAt,
      title: title.trim(),
    };

    if (!input.title || !input.startsAt) {
      return;
    }

    await props.onSave(input);

    setDescription("");

    setEndsAt("");

    setStartsAt("");

    setTitle("");
  };

  return {
    create,
    description,
    endsAt,
    setDescription,
    setEndsAt,
    setStartsAt,
    setTitle,
    startsAt,
    title,
  };
}

import { useState } from "react";
import type { CalendarEntryFormInput } from "./calendar-entry-form-input.interface";
import type { CalendarEntryFormProps } from "./calendar-entry-form-props.interface";
import type { CalendarEntryFormState } from "./calendar-entry-form-state.interface";

export function useCalendarEntryFormState(props: CalendarEntryFormProps): CalendarEntryFormState {
  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [startsAt, setStartsAt] = useState("");

  const [endsAt, setEndsAt] = useState("");

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

    await props.onCreate(input);

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

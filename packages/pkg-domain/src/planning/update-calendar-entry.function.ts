import type { UpdateCalendarEntryInput } from "./update-calendar-entry-input.interface";
import type { CalendarEntry } from "../models/calendar-entry.interface";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export function updateCalendarEntry(input: UpdateCalendarEntryInput): PersonalWorkspace {
  const entries = input.workspace.calendarEntries ?? [];

  const nextEntries = entries.map((entry): CalendarEntry => {
    if (entry.id !== input.id) {
      return entry;
    }

    return {
      ...entry,
      description: input.description,
      endsAt: input.endsAt,
      startsAt: input.startsAt,
      title: input.title,
      updatedAt: input.now,
    };
  });

  return { ...input.workspace, calendarEntries: nextEntries };
}

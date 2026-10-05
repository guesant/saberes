import type { CreateCalendarEntryInput } from "./create-calendar-entry-input.interface";
import type { CalendarEntry } from "../models/calendar-entry.interface";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export function createCalendarEntry(input: CreateCalendarEntryInput): PersonalWorkspace {
  const entries = input.workspace.calendarEntries ?? [];

  const existingEntry = entries.find((entry) => { return entry.id === input.id; });

  if (existingEntry) {
    return input.workspace;
  }

  const entry: CalendarEntry = {
    createdAt: input.now,
    description: input.description,
    endsAt: input.endsAt,
    id: input.id,
    sourceCaptureId: input.sourceCaptureId,
    startsAt: input.startsAt,
    status: "scheduled",
    title: input.title,
    updatedAt: input.now,
  };

  return { ...input.workspace, calendarEntries: [...entries, entry] };
}

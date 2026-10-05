import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export function deleteCalendarEntry(workspace: PersonalWorkspace, id: string): PersonalWorkspace {
  return {
    ...workspace,
    calendarEntries: (workspace.calendarEntries ?? []).filter((entry) => {
      return entry.id !== id;
    }),
  };
}

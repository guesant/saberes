import { deleteCalendarEntry, updateCalendarEntry } from "@guesant/saberes-application";
import type { CalendarEntryCrudActionDependencies } from "./calendar-entry-crud-action-dependencies.interface";
import type { CalendarViewModel } from "./calendar-view-model.interface";

export function createCalendarEntryCrudActions(
  input: CalendarEntryCrudActionDependencies,
): Pick<CalendarViewModel, "deleteEntry" | "updateEntry"> {
  return {
    deleteEntry: async (id): Promise<void> => {
      const workspace = await input.services.personal.get.execute();

      await input.services.personal.save.execute(deleteCalendarEntry(workspace, id));

      await input.refetch();
    },
    updateEntry: async (id, entry): Promise<void> => {
      const workspace = await input.services.personal.get.execute();

      await input.services.personal.save.execute(updateCalendarEntry({
        ...entry,
        id,
        now: new Date()
          .toISOString(),
        workspace,
      }));

      await input.refetch();
    },
  };
}

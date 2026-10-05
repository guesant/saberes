import type { CreateCalendarEntryCommandHandler } from "../commands/create-calendar-entry.command-handler";
import type { ListCalendarEntriesQueryHandler } from "../queries/list-calendar-entries.query-handler";

export interface PlanningServices {
  createCalendarEntry: CreateCalendarEntryCommandHandler;
  listCalendarEntries: ListCalendarEntriesQueryHandler;
}

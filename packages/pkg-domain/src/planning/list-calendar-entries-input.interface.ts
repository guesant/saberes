import type { CalendarView } from "../models/calendar-view.type";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export interface ListCalendarEntriesInput {
  workspace: PersonalWorkspace;
  view: CalendarView;
  anchorDate: string;
}

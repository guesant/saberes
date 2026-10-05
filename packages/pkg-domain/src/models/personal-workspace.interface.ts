import type { CalendarEntry } from "./calendar-entry.interface";
import type { PersonalActivity } from "./personal-activity.interface";
import type { PersonalNote } from "./personal-note.interface";
import type { PersonalReference } from "./personal-reference.interface";
import type { StudyCapture } from "./study-capture.interface";
import type { StudyChecklist } from "./study-checklist.interface";

export interface PersonalWorkspace {
  activities: PersonalActivity[];
  calendarEntries?: CalendarEntry[];
  notes: PersonalNote[];
  checklists: StudyChecklist[];
  captures: StudyCapture[];
  references: PersonalReference[];
}

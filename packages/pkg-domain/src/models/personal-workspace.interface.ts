import type { CalendarEntry } from "./calendar-entry.interface";
import type { PersonalActivity } from "./personal-activity.interface";
import type { PersonalLens } from "./personal-lens.interface";
import type { PersonalNote } from "./personal-note.interface";
import type { PersonalReference } from "./personal-reference.interface";
import type { PersonalRelation } from "./personal-relation.interface";
import type { StudyCapture } from "./study-capture.interface";
import type { StudyChecklist } from "./study-checklist.interface";

export interface PersonalWorkspace {
  activities: PersonalActivity[];
  calendarEntries?: CalendarEntry[];
  checklists: StudyChecklist[];
  captures: StudyCapture[];
  lenses?: PersonalLens[];
  notes: PersonalNote[];
  references: PersonalReference[];
  relations?: PersonalRelation[];
}

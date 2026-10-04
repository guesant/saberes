import type { PersonalNote } from "./personal-note.interface";
import type { PersonalReference } from "./personal-reference.interface";
import type { StudyCapture } from "./study-capture.interface";
import type { StudyChecklist } from "./study-checklist.interface";

export interface PersonalWorkspace {
  notes: PersonalNote[];
  checklists: StudyChecklist[];
  captures: StudyCapture[];
  references: PersonalReference[];
}

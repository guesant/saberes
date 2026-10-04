import type { StudyChecklistEditorContent } from "./study-checklist-editor-content.interface";
import type { StudyChecklistEditorItem } from "./study-checklist-editor-item.interface";

export interface StudyChecklistEditorValues {
  content: StudyChecklistEditorContent;
  items: StudyChecklistEditorItem[];
}

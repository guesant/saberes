import type { StudyChecklistEditorValues } from "./study-checklist-editor-values.interface";

export interface StudyChecklistEditorFormOptions {
  initialValues: StudyChecklistEditorValues;
  onSave(values: StudyChecklistEditorValues): Promise<void>;
}

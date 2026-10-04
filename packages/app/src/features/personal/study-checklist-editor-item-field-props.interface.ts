import type { StudyChecklistEditorFormApi } from "./study-checklist-editor-form-api.type";

export interface StudyChecklistEditorItemFieldProps {
  form: StudyChecklistEditorFormApi;
  index: number;
  remove(): void;
}

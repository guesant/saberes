import type { StudyChecklistEditorFormApi } from "./study-checklist-editor-form-api.type";

export interface StudyChecklistEditorActionsProps {
  form: StudyChecklistEditorFormApi;
  createLabel: string;
  onCancel(): void;
}

import type { StudyChecklistEditorValues } from "./study-checklist-editor-values.interface";
import type { UpdateStudyChecklistContentActionInput } from "./update-study-checklist-content-action-input.interface";

export interface SaveStudyChecklistEditorValuesInput {
  id: string;
  onSaved(): void;

  onUpdateContent(input: UpdateStudyChecklistContentActionInput): Promise<void>;
  values: StudyChecklistEditorValues;
}

import type { StudyCaptureContentInput } from "./study-capture-content-input.interface";

export interface CreateStudyCaptureSaveActionInput {
  onUpdateContent(input: StudyCaptureContentInput): Promise<void>;

  setEditing(editing: boolean): void;
}

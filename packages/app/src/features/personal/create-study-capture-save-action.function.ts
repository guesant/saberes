import type { CreateStudyCaptureSaveActionInput } from "./create-study-capture-save-action-input.interface";
import type { StudyCaptureContentInput } from "./study-capture-content-input.interface";
import type { StudyCaptureSaveAction } from "./study-capture-save-action.type";

export function createStudyCaptureSaveAction(
  input: CreateStudyCaptureSaveActionInput,
): StudyCaptureSaveAction {
  return async (content: StudyCaptureContentInput): Promise<void> => {
    await input.onUpdateContent(content);

    input.setEditing(false);
  };
}

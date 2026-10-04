import { updateStudyCaptureContent } from "./update-study-capture-content.function";
import type { PersonalWorkspaceActionsInput } from "./personal-workspace-actions-input.interface";
import type { StudyCaptureContentInput } from "./study-capture-content-input.interface";

export function createStudyCaptureContentUpdateAction(input: PersonalWorkspaceActionsInput) {
  return async (content: StudyCaptureContentInput): Promise<void> =>
    input.save(updateStudyCaptureContent({ ...content, workspace: input.workspace }));
}

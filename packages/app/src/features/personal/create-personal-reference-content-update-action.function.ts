import { updatePersonalReferenceContent } from "./update-personal-reference-content.function";
import type { PersonalWorkspaceActionsInput } from "./personal-workspace-actions-input.interface";

export function createPersonalReferenceContentUpdateAction(input: PersonalWorkspaceActionsInput) {
  return async (id: string, title: string, source: string): Promise<void> =>
    input.save(updatePersonalReferenceContent({ id, source, title, workspace: input.workspace }));
}

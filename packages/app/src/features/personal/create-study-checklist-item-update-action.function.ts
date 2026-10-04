import { updateStudyChecklistItem } from "./update-study-checklist-item.function";
import type { PersonalWorkspaceActionsInput } from "./personal-workspace-actions-input.interface";
import type { AsyncAction } from "../../types/async-action.type";

export function createStudyChecklistItemUpdateAction(
  input: PersonalWorkspaceActionsInput,
): AsyncAction<[string, string], void> {
  return async (checklistId: string, itemId: string): Promise<void> =>
    input.save(
      updateStudyChecklistItem({
        workspace: input.workspace,
        checklistId,
        itemId,
        now: new Date().toISOString(),
      }),
    );
}

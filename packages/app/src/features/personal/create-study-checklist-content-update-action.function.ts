import { getStudyChecklistValues } from "./get-study-checklist-values.function";
import { updateStudyChecklistContent } from "./update-study-checklist-content.function";
import type { PersonalWorkspaceActionsInput } from "./personal-workspace-actions-input.interface";
import type { UpdateStudyChecklistContentActionInput } from "./update-study-checklist-content-action-input.interface";
import type { AsyncAction } from "../../types/async-action.type";

export function createStudyChecklistContentUpdateAction(
  input: PersonalWorkspaceActionsInput,
): AsyncAction<[UpdateStudyChecklistContentActionInput], void> {
  return async (actionInput: UpdateStudyChecklistContentActionInput): Promise<void> => {
    const values = getStudyChecklistValues(actionInput.items);

    await input.save(
      updateStudyChecklistContent({
        id: actionInput.id,
        itemIds: values.map(() => input.generateId()),
        items: values,
        now: new Date().toISOString(),
        contentKey: actionInput.contentKey,
        title: actionInput.title,
        workspace: input.workspace,
      }),
    );
  };
}

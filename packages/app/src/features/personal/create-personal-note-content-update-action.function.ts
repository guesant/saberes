import { updatePersonalNoteContent } from "./update-personal-note-content.function";
import type { PersonalWorkspaceActionsInput } from "./personal-workspace-actions-input.interface";
import type { UpdatePersonalNoteContentActionInput } from "./update-personal-note-content-action-input.interface";
import type { AsyncAction } from "../../types/async-action.type";

export function createPersonalNoteContentUpdateAction(
  input: PersonalWorkspaceActionsInput,
): AsyncAction<[UpdatePersonalNoteContentActionInput], void> {
  return async (actionInput: UpdatePersonalNoteContentActionInput): Promise<void> =>
    input.save(
      updatePersonalNoteContent({
        body: actionInput.body,
        contentKey: actionInput.contentKey,
        id: actionInput.id,
        title: actionInput.title,
        workspace: input.workspace,
      }),
    );
}

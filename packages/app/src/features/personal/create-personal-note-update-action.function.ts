import { updatePersonalNote } from "./update-personal-note.function";
import type { PersonalWorkspaceActionsInput } from "./personal-workspace-actions-input.interface";
import type { AsyncAction } from "../../types/async-action.type";

export function createPersonalNoteUpdateAction(
  input: PersonalWorkspaceActionsInput,
): AsyncAction<[string], void> {
  return async (id: string): Promise<void> => {
    return input.save(
      updatePersonalNote({
        workspace: input.workspace,
        id,
        now: new Date()
          .toISOString(),
      }),
    );
  };
}

import { updatePersonalReferenceFavorite } from "./update-personal-reference-favorite.function";
import type { PersonalWorkspaceActionsInput } from "./personal-workspace-actions-input.interface";
import type { AsyncAction } from "../../types/async-action.type";

export function createPersonalReferenceFavoriteUpdateAction(
  input: PersonalWorkspaceActionsInput,
): AsyncAction<[string], void> {
  return async (id: string): Promise<void> => {
    return input.save(
      updatePersonalReferenceFavorite({
        workspace: input.workspace,
        id,
        now: new Date()
          .toISOString(),
      }),
    );
  };
}

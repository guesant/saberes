import { deletePersonalLens } from "@guesant/saberes-application";
import type { PersonalLensDeleteAction } from "./personal-lens-delete-action.type";
import type { PersonalWorkspaceActionsInput } from "./personal-workspace-actions-input.interface";

export function createPersonalWorkspaceDeleteLensAction(
  input: PersonalWorkspaceActionsInput,
): PersonalLensDeleteAction {
  return async (id: string): Promise<void> => {
    await input.save(deletePersonalLens(input.workspace, id));
  };
}

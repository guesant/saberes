import { createPersonalWorkspaceDeleteLensAction } from "./create-personal-workspace-delete-lens-action.function";
import { createPersonalWorkspaceSaveLensAction } from "./create-personal-workspace-save-lens-action.function";
import type { PersonalWorkspaceActionsInput } from "./personal-workspace-actions-input.interface";
import type { PersonalWorkspaceViewModel } from "./personal-workspace-view-model.interface";

export function createPersonalWorkspaceLensActions(
  input: PersonalWorkspaceActionsInput,
): Pick<PersonalWorkspaceViewModel, "deleteLens" | "saveLens"> {
  return {
    deleteLens: createPersonalWorkspaceDeleteLensAction(input),
    saveLens: createPersonalWorkspaceSaveLensAction(input),
  };
}

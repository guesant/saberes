import type { PersonalWorkspaceMutation } from "./personal-workspace-mutation.interface";
import type { PersonalWorkspaceSaveAction } from "./personal-workspace-save-action.type";
import type { PersonalWorkspace } from "@guesant/saberes-application";

export function createPersonalWorkspaceSaveAction(
  mutation: PersonalWorkspaceMutation,
): PersonalWorkspaceSaveAction {
  return async (workspace: PersonalWorkspace): Promise<void> => {
    await mutation.mutateAsync(workspace);
  };
}

import { updateStudyCaptureArchive } from "./update-study-capture-archive.function";
import type { PersonalWorkspaceActionsInput } from "./personal-workspace-actions-input.interface";
import type { AsyncAction } from "../../types/async-action.type";

export function createStudyCaptureArchiveUpdateAction(
  input: PersonalWorkspaceActionsInput,
): AsyncAction<[string], void> {
  return async (id: string): Promise<void> =>
    input.save(
      updateStudyCaptureArchive({
        workspace: input.workspace,
        id,
        now: new Date().toISOString(),
      }),
    );
}

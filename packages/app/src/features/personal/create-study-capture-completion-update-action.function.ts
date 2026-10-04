import { updateStudyCaptureCompletion } from "./update-study-capture-completion.function";
import type { PersonalWorkspaceActionsInput } from "./personal-workspace-actions-input.interface";
import type { AsyncAction } from "../../types/async-action.type";

export function createStudyCaptureCompletionUpdateAction(
  input: PersonalWorkspaceActionsInput,
): AsyncAction<[string], void> {
  return async (id: string): Promise<void> => {
    return input.save(
      updateStudyCaptureCompletion({
        workspace: input.workspace,
        id,
        now: new Date()
          .toISOString(),
      }),
    );
  };
}

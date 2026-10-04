import { moveStudyChecklistItem } from "./move-study-checklist-item.function";
import type { PersonalWorkspaceActionsInput } from "./personal-workspace-actions-input.interface";
import type { AsyncAction } from "../../types/async-action.type";

export function createStudyChecklistItemMoveAction(
  input: PersonalWorkspaceActionsInput,
): AsyncAction<[string, string, "down" | "up"], void> {
  return async (checklistId: string, itemId: string, direction: "down" | "up"): Promise<void> =>
    input.save(
      moveStudyChecklistItem({
        checklistId,
        direction,
        itemId,
        now: new Date().toISOString(),
        workspace: input.workspace,
      }),
    );
}

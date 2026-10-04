import { moveStudyChecklist } from "./move-study-checklist.function";
import type { MoveStudyChecklistItemInput } from "./move-study-checklist-item-input.interface";
import type { PersonalWorkspace } from "@guesant/saberes-application";

export function moveStudyChecklistItem(input: MoveStudyChecklistItemInput): PersonalWorkspace {
  return {
    ...input.workspace,
    checklists: input.workspace.checklists.map((checklist) =>
      checklist.id === input.checklistId
        ? moveStudyChecklist({
            checklist,
            direction: input.direction,
            itemId: input.itemId,
            now: input.now,
          })
        : checklist,
    ),
  };
}

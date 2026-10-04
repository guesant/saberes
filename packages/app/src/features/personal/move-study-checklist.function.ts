import { getStudyChecklistTargetIndex } from "./get-study-checklist-target-index.function";
import { swapStudyChecklistItems } from "./swap-study-checklist-items.function";
import type { MoveStudyChecklistInput } from "./move-study-checklist-input.interface";
import type { StudyChecklist } from "@guesant/saberes-application";

export function moveStudyChecklist(input: MoveStudyChecklistInput): StudyChecklist {
  const currentIndex = input.checklist.items.findIndex((item) => item.id === input.itemId);

  const targetIndex = getStudyChecklistTargetIndex(currentIndex, input.direction);

  if (currentIndex < 0 || targetIndex < 0 || targetIndex >= input.checklist.items.length) {
    return input.checklist;
  }

  const items = swapStudyChecklistItems({
    currentIndex,
    items: input.checklist.items,
    targetIndex,
  });

  return items === input.checklist.items
    ? input.checklist
    : { ...input.checklist, items, updatedAt: input.now };
}

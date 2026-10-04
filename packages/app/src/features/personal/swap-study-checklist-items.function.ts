import type { SwapStudyChecklistItemsInput } from "./swap-study-checklist-items-input.interface";
import type { StudyChecklistItem } from "@guesant/saberes-application";

export function swapStudyChecklistItems(input: SwapStudyChecklistItemsInput): StudyChecklistItem[] {
  const currentItem = input.items[input.currentIndex];

  const targetItem = input.items[input.targetIndex];

  if (!currentItem || !targetItem) {
    return input.items;
  }

  const items = [...input.items];

  items[input.currentIndex] = { ...targetItem, position: input.currentIndex };

  items[input.targetIndex] = { ...currentItem, position: input.targetIndex };

  return items;
}

import type { UpdateStudyChecklistContentInput } from "./update-study-checklist-content-input.interface";
import type { StudyChecklistItem } from "@guesant/saberes-application";

export function getUpdatedStudyChecklistItems(
  input: UpdateStudyChecklistContentInput,
  previousItems: StudyChecklistItem[],
): StudyChecklistItem[] {
  return input.items.map((label, position) => {
    return {
      completed: previousItems[position]?.completed ?? false,
      id: previousItems[position]?.id ?? input.itemIds[position],
      label,
      position,
    };
  });
}

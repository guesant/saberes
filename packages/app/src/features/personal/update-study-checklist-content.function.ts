import { getUpdatedStudyChecklistItems } from "./get-updated-study-checklist-items.function";
import type { UpdateStudyChecklistContentInput } from "./update-study-checklist-content-input.interface";
import type { PersonalWorkspace } from "@guesant/saberes-application";

export function updateStudyChecklistContent(
  input: UpdateStudyChecklistContentInput,
): PersonalWorkspace {
  return {
    ...input.workspace,
    checklists: input.workspace.checklists.map((checklist) => {
      return checklist.id === input.id
        ? {
          ...checklist,
          items: getUpdatedStudyChecklistItems(input, checklist.items),
          contentKey: input.contentKey,
          title: input.title,
          updatedAt: input.now,
        }
        : checklist;
    }),
  };
}

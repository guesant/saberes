import type { PersonalWorkspace } from "@guesant/saberes-application";

export interface UpdateStudyChecklistItemInput {
  workspace: PersonalWorkspace;
  checklistId: string;
  itemId: string;
  now: string;
}

export function updateStudyChecklistItem(input: UpdateStudyChecklistItemInput): PersonalWorkspace {
  return {
    ...input.workspace,
    checklists: input.workspace.checklists.map((checklist) =>
      checklist.id === input.checklistId
        ? {
            ...checklist,
            items: checklist.items.map((item) =>
              item.id === input.itemId ? { ...item, completed: !item.completed } : item,
            ),
            updatedAt: input.now,
          }
        : checklist,
    ),
  };
}

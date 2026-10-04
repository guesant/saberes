import type { PersonalWorkspace, StudyChecklist } from "@guesant/saberes-application";

export interface AddStudyChecklistInput {
  workspace: PersonalWorkspace;
  id: string;
  itemIds: string[];
  title: string;
  items: string[];
  contentKey?: string;
  now: string;
}

export function addStudyChecklist(input: AddStudyChecklistInput): PersonalWorkspace {
  const checklist: StudyChecklist = {
    id: input.id,
    title: input.title,
    contentKey: input.contentKey,
    items: input.items.map((label, position) => {
      return {
        id: input.itemIds[position],
        label,
        completed: false,
        position,
      };
    }),
    archived: false,
    createdAt: input.now,
    updatedAt: input.now,
  };

  return { ...input.workspace, checklists: [...input.workspace.checklists, checklist] };
}

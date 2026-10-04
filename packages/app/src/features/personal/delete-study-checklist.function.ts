import type { PersonalWorkspace } from "@guesant/saberes-application";

export function deleteStudyChecklist(workspace: PersonalWorkspace, id: string): PersonalWorkspace {
  return {
    ...workspace,
    checklists: workspace.checklists.map((checklist) =>
      checklist.id === id ? { ...checklist, archived: true } : checklist,
    ),
  };
}

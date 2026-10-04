import type { PersonalWorkspace } from "@guesant/saberes-application";

export function restoreStudyChecklist(workspace: PersonalWorkspace, id: string): PersonalWorkspace {
  return {
    ...workspace,
    checklists: workspace.checklists.map((checklist) =>
      checklist.id === id ? { ...checklist, archived: false } : checklist,
    ),
  };
}

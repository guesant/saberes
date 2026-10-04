import type { PersonalWorkspace } from "@guesant/saberes-application";

export function restorePersonalNote(workspace: PersonalWorkspace, id: string): PersonalWorkspace {
  return {
    ...workspace,
    notes: workspace.notes.map((note) => {
      return note.id === id ? { ...note, archived: false } : note;
    }),
  };
}

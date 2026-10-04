import type { PersonalWorkspace } from "@guesant/saberes-application";

export function deletePersonalNote(workspace: PersonalWorkspace, id: string): PersonalWorkspace {
  return {
    ...workspace,
    notes: workspace.notes.map((note) => (note.id === id ? { ...note, archived: true } : note)),
  };
}

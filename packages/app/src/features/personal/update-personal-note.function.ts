import type { PersonalWorkspace } from "@guesant/saberes-application";

export interface UpdatePersonalNoteInput {
  workspace: PersonalWorkspace;
  id: string;
  now: string;
}

export function updatePersonalNote(input: UpdatePersonalNoteInput): PersonalWorkspace {
  return {
    ...input.workspace,
    notes: input.workspace.notes.map((note) => {
      return note.id === input.id ? { ...note, archived: true, updatedAt: input.now } : note;
    }),
  };
}

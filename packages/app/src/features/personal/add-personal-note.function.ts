import type { PersonalNote, PersonalWorkspace } from "@guesant/saberes-application";

export interface AddPersonalNoteInput {
  workspace: PersonalWorkspace;
  id: string;
  title: string;
  body: string;
  contentKey?: string;
  now: string;
}

export function addPersonalNote(input: AddPersonalNoteInput): PersonalWorkspace {
  const note: PersonalNote = {
    id: input.id,
    title: input.title,
    body: input.body,
    contentKey: input.contentKey,
    archived: false,
    createdAt: input.now,
    updatedAt: input.now,
  };

  return { ...input.workspace, notes: [...input.workspace.notes, note] };
}

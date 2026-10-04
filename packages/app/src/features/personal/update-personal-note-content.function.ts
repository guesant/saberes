import type { UpdatePersonalNoteContentInput } from "./update-personal-note-content-input.interface";
import type { PersonalWorkspace } from "@guesant/saberes-application";

export function updatePersonalNoteContent(
  input: UpdatePersonalNoteContentInput,
): PersonalWorkspace {
  return {
    ...input.workspace,
    notes: input.workspace.notes.map((note) =>
      note.id === input.id
        ? {
            ...note,
            title: input.title,
            body: input.body,
            contentKey: input.contentKey,
            updatedAt: new Date().toISOString(),
          }
        : note,
    ),
  };
}

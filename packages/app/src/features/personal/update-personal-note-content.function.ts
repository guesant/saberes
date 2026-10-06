import { parseContentReference } from "@guesant/saberes-application";
import type { UpdatePersonalNoteContentInput } from "./update-personal-note-content-input.interface";
import type { PersonalWorkspace } from "@guesant/saberes-application";

export function updatePersonalNoteContent(
  input: UpdatePersonalNoteContentInput,
): PersonalWorkspace {
  return {
    ...input.workspace,
    notes: input.workspace.notes.map((note) => {
      return note.id === input.id
        ? {
          ...note,
          title: input.title,
          body: input.body,
          contentReference: parseContentReference(input.contentKey),
          updatedAt: new Date()
            .toISOString(),
        }
        : note;
    }),
  };
}

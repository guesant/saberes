import type { PersonalNote } from "@guesant/saberes-application";

export function getPersonalNotesByArchiveState(
  notes: PersonalNote[],
  archived: boolean,
): PersonalNote[] {
  return notes.filter((note) => { return note.archived === archived; });
}

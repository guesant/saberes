import { useState } from "react";
import type { PersonalNoteEditingState } from "./personal-note-editing-state.interface";
import type { PersonalNote } from "@guesant/saberes-application";

export function usePersonalNoteEditingState(note: PersonalNote): PersonalNoteEditingState {
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState(note.title);

  const [body, setBody] = useState(note.body);

  const [contentKey, setContentKey] = useState(note.contentKey ?? "");

  return { body, contentKey, editing, setBody, setContentKey, setEditing, setTitle, title };
}

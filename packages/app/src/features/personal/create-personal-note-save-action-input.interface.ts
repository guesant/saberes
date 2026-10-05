import type { PersonalNoteEditingState } from "./personal-note-editing-state.interface";
import type { UpdatePersonalNoteContentActionInput } from "./update-personal-note-content-action-input.interface";

export interface CreatePersonalNoteSaveActionInput {
  editor: PersonalNoteEditingState;
  noteId: string;
  onUpdateContent(input: UpdatePersonalNoteContentActionInput): Promise<void>;
}

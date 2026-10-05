import type { CreatePersonalNoteSaveActionInput } from "./create-personal-note-save-action-input.interface";
import type { PersonalNoteSaveAction } from "./personal-note-save-action.type";

export function createPersonalNoteSaveAction(
  input: CreatePersonalNoteSaveActionInput,
): PersonalNoteSaveAction {
  return async (): Promise<void> => {
    await input.onUpdateContent({
      body: input.editor.body.trim(),
      contentKey: input.editor.contentKey.trim() || undefined,
      id: input.noteId,
      title: input.editor.title.trim(),
    });

    input.editor.setEditing(false);
  };
}

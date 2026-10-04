import { PersonalNoteDisplay } from "./personal-note-display.component";
import { PersonalNoteEditor } from "./personal-note-editor.component";
import { usePersonalNoteEditingState } from "./use-personal-note-editing-state.hook";
import type { UpdatePersonalNoteContentActionInput } from "./update-personal-note-content-action-input.interface";
import type { PersonalNote } from "@guesant/saberes-application";

export interface PersonalNoteItemProps {
  note: PersonalNote;
  onUpdate(id: string): Promise<void>;

  onDelete(id: string): Promise<void>;

  onUpdateContent(input: UpdatePersonalNoteContentActionInput): Promise<void>;
}

export function PersonalNoteItem(props: PersonalNoteItemProps) {
  const editor = usePersonalNoteEditingState(props.note);

  const save = async (): Promise<void> => {
    await props.onUpdateContent({
      body: editor.body.trim(),
      contentKey: editor.contentKey.trim() || undefined,
      id: props.note.id,
      title: editor.title.trim(),
    });

    editor.setEditing(false);
  };

  if (editor.editing) {
    return (
      <PersonalNoteEditor
        body={editor.body}
        contentKey={editor.contentKey}
        onBodyChange={editor.setBody}
        onContentKeyChange={editor.setContentKey}
        onCancel={() => editor.setEditing(false)}
        onSave={save}
        onTitleChange={editor.setTitle}
        title={editor.title}
      />
    );
  }

  return (
    <PersonalNoteDisplay
      note={props.note}
      onArchive={() => props.onUpdate(props.note.id)}
      onDelete={() => props.onDelete(props.note.id)}
      onEdit={() => editor.setEditing(true)}
    />
  );
}

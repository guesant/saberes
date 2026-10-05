import { createPersonalNoteSaveAction } from "./create-personal-note-save-action.function";
import { PersonalNoteDisplay } from "./personal-note-display.component";
import { PersonalNoteEditor } from "./personal-note-editor.component";
import { usePersonalNoteEditingState } from "./use-personal-note-editing-state.hook";
import type { PersonalEntitySelection } from "./personal-entity-selection.interface";
import type { UpdatePersonalNoteContentActionInput } from "./update-personal-note-content-action-input.interface";
import type { PersonalNote } from "@guesant/saberes-application";

export interface PersonalNoteItemProps {
  selection: PersonalEntitySelection;
  note: PersonalNote;
  onUpdate(id: string): Promise<void>;

  onDelete(id: string): Promise<void>;

  onUpdateContent(input: UpdatePersonalNoteContentActionInput): Promise<void>;
}

export function PersonalNoteItem(props: PersonalNoteItemProps) {
  const editor = usePersonalNoteEditingState(props.note);

  const save = createPersonalNoteSaveAction({ editor, noteId: props.note.id, onUpdateContent: props.onUpdateContent });

  if (editor.editing) {
    return (
      <PersonalNoteEditor
        body={editor.body}
        contentKey={editor.contentKey}
        onBodyChange={editor.setBody}
        onContentKeyChange={editor.setContentKey}
        onCancel={() => { return editor.setEditing(false); }}
        onSave={save}
        onTitleChange={editor.setTitle}
        title={editor.title}
      />
    );
  }

  return (
    <PersonalNoteDisplay
      note={props.note}
      onSelect={props.selection.select}
      selected={props.selection.isSelected({ id: props.note.id, recordType: "note" })}
      onArchive={() => { return props.onUpdate(props.note.id); }}
      onDelete={() => { return props.onDelete(props.note.id); }}
      onEdit={() => { return editor.setEditing(true); }}
    />
  );
}

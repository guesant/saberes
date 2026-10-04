import { UIButton, UIContentGroup, UITextField } from "@guesant/saberes-ui";
import { PersonalContentKeyField } from "./personal-content-key-field.component";

export interface PersonalNoteEditorProps {
  title: string;
  body: string;
  contentKey: string;
  onTitleChange(value: string): void;

  onBodyChange(value: string): void;

  onContentKeyChange(value: string): void;

  onSave(): Promise<void>;

  onCancel(): void;
}

export function PersonalNoteEditor(props: PersonalNoteEditorProps) {
  return (
    <UIContentGroup variant="tight">
      <UITextField
        label="Título"
        onChange={(event) => {
          return props.onTitleChange(event.target.value);
        }}
        value={props.title}
      />
      <UITextField
        label="Texto"
        multiline
        onChange={(event) => {
          return props.onBodyChange(event.target.value);
        }}
        value={props.body}
      />
      <PersonalContentKeyField onChange={props.onContentKeyChange} value={props.contentKey} />
      <UIButton
        disabled={!props.title.trim() || !props.body.trim()}
        onClick={props.onSave}
        variant="contained"
      >
        Salvar edição
      </UIButton>
      <UIButton onClick={props.onCancel} variant="text">
        Cancelar
      </UIButton>
    </UIContentGroup>
  );
}

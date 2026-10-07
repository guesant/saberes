import { UIButton, UIContentGroup, UIInlineActions, UITextField } from "@guesant/saberes-ui";

export interface PersonalReferenceEditorProps {
  title: string;
  source: string;
  onTitleChange(value: string): void;

  onSourceChange(value: string): void;

  onSave(): Promise<void>;

  onCancel(): void;
}

export function PersonalReferenceEditor(props: PersonalReferenceEditorProps) {
  return (
    <UIContentGroup variant="content">
      <UITextField
        label="Título"
        onChange={(event) => {
          return props.onTitleChange(event.target.value);
        }}
        value={props.title}
      />
      <UITextField
        label="Fonte ou endereço"
        onChange={(event) => {
          return props.onSourceChange(event.target.value);
        }}
        value={props.source}
      />
      <UIInlineActions stacked>
        <UIButton
          disabled={!props.title.trim() || !props.source.trim()}
          onClick={props.onSave}
          variant="contained"
        >
          Salvar edição
        </UIButton>
        <UIButton onClick={props.onCancel} variant="text">
          Cancelar
        </UIButton>
      </UIInlineActions>
    </UIContentGroup>
  );
}

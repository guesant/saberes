import { UIButton, UIContentGroup, UITextField } from "@guesant/saberes-ui";

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
    <UIContentGroup variant="tight">
      <UITextField
        label="Título"
        onChange={(event) => props.onTitleChange(event.target.value)}
        value={props.title}
      />
      <UITextField
        label="Fonte ou endereço"
        onChange={(event) => props.onSourceChange(event.target.value)}
        value={props.source}
      />
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
    </UIContentGroup>
  );
}

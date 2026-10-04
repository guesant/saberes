import { UIButton, UIContentGroup, UITextField } from "@guesant/saberes-ui";

export interface StudyCaptureEditorProps {
  title: string;
  description: string;
  onTitleChange(value: string): void;

  onDescriptionChange(value: string): void;

  dueDate: string;

  onDueDateChange(value: string): void;

  onSave(): Promise<void>;

  onCancel(): void;
}

export function StudyCaptureEditor(props: StudyCaptureEditorProps) {
  return (
    <UIContentGroup variant="tight">
      <UITextField
        label="Título"
        onChange={(event) => { return props.onTitleChange(event.target.value); }}
        value={props.title}
      />
      <UITextField
        label="Descrição"
        multiline
        onChange={(event) => { return props.onDescriptionChange(event.target.value); }}
        value={props.description}
      />
      <UITextField
        label="Prazo (opcional)"
        onChange={(event) => { return props.onDueDateChange(event.target.value); }}
        type="date"
        value={props.dueDate}
      />
      <UIButton
        disabled={!props.title.trim() || !props.description.trim()}
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

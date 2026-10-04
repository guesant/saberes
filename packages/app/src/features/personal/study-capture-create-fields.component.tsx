import { UIButton, UIContentGroup, UITextField } from "@guesant/saberes-ui";
import { PersonalContentKeyField } from "./personal-content-key-field.component";
import type { StudyCaptureCreateFieldsProps } from "./study-capture-create-fields-props.interface";

export function StudyCaptureCreateFields(props: StudyCaptureCreateFieldsProps) {
  return (
    <UIContentGroup variant="tight">
      <UITextField
        label="Título da pendência"
        onChange={(event) => props.onTitleChange(event.target.value)}
        value={props.title}
      />
      <UITextField
        label="Descrição"
        multiline
        onChange={(event) => props.onDescriptionChange(event.target.value)}
        value={props.description}
      />
      <PersonalContentKeyField onChange={props.onContentKeyChange} value={props.contentKey} />
      <UITextField
        label="Prazo (opcional)"
        onChange={(event) => props.onDueDateChange(event.target.value)}
        type="date"
        value={props.dueDate}
      />
      <UIButton onClick={props.onCreate} variant="outlined">
        Salvar pendência
      </UIButton>
    </UIContentGroup>
  );
}

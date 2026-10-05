import { UITextField } from "@guesant/saberes-ui";
import { PersonalContentKeyField } from "./personal-content-key-field.component";
import type { StudyCaptureCreateInputsProps } from "./study-capture-create-inputs-props.interface";

export function StudyCaptureCreateInputs(props: StudyCaptureCreateInputsProps) {
  return (
    <>
      <UITextField
        label="Título da pendência"
        onChange={(event) => {
          return props.onTitleChange(event.target.value);
        }}
        required
        value={props.title}
      />
      <UITextField
        label="Descrição"
        multiline
        onChange={(event) => {
          return props.onDescriptionChange(event.target.value);
        }}
        required
        value={props.description}
      />
      <PersonalContentKeyField onChange={props.onContentKeyChange} value={props.contentKey} />
      <UITextField
        label="Prazo (opcional)"
        onChange={(event) => {
          return props.onDueDateChange(event.target.value);
        }}
        type="date"
        value={props.dueDate}
      />
    </>
  );
}

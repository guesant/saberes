import { UIContentGroup, UITextField } from "@guesant/saberes-ui";
import { PersonalContentKeyField } from "./personal-content-key-field.component";
import type { PersonalReferenceCreateFieldsProps } from "./personal-reference-create-fields-props.interface";

export function PersonalReferenceCreateFields(props: PersonalReferenceCreateFieldsProps) {
  return (
    <UIContentGroup variant="content">
      <UITextField
        label="Título da referência"
        onChange={(event) => {
          return props.onTitleChange(event.target.value);
        }}
        required
        value={props.title}
      />
      <UITextField
        label="Fonte ou endereço"
        onChange={(event) => {
          return props.onSourceChange(event.target.value);
        }}
        required
        value={props.source}
      />
      <PersonalContentKeyField onChange={props.onContentKeyChange} value={props.contentKey} />
    </UIContentGroup>
  );
}

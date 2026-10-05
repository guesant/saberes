import { UIContentGroup, UITextField } from "@guesant/saberes-ui";
import { PersonalContentKeyField } from "./personal-content-key-field.component";
import type { StudyChecklistCreateFieldsProps } from "./study-checklist-create-fields-props.interface";

export function StudyChecklistCreateFields(props: StudyChecklistCreateFieldsProps) {
  return (
    <UIContentGroup variant="content">
      <UITextField
        label="Título do checklist"
        onChange={(event) => {
          return props.onTitleChange(event.target.value);
        }}
        required
        value={props.title}
      />
      <UITextField
        label="Itens, um por linha"
        multiline
        onChange={(event) => {
          return props.onItemsChange(event.target.value);
        }}
        required
        value={props.items}
      />
      <PersonalContentKeyField onChange={props.onContentKeyChange} value={props.contentKey} />
    </UIContentGroup>
  );
}

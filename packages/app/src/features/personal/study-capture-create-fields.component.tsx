import { UIContentGroup } from "@guesant/saberes-ui";
import { StudyCaptureCreateInputs } from "./study-capture-create-inputs.component";
import type { StudyCaptureCreateFieldsProps } from "./study-capture-create-fields-props.interface";

export function StudyCaptureCreateFields(props: StudyCaptureCreateFieldsProps) {
  return (
    <UIContentGroup variant="content">
      <StudyCaptureCreateInputs
        contentKey={props.contentKey}
        description={props.description}
        dueDate={props.dueDate}
        onContentKeyChange={props.onContentKeyChange}
        onDescriptionChange={props.onDescriptionChange}
        onDueDateChange={props.onDueDateChange}
        onTitleChange={props.onTitleChange}
        title={props.title}
      />
    </UIContentGroup>
  );
}

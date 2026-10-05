import { UIButton, UIContentGroup, UITextField } from "@guesant/saberes-ui";
import type { StudyChecklistEditorItemFieldProps } from "./study-checklist-editor-item-field-props.interface";

export function StudyChecklistEditorItemField(props: StudyChecklistEditorItemFieldProps) {
  const { form } = props;

  return (
    <form.Field name={`items[${props.index}].label`}>
      {(field) => {
        return (
          <UIContentGroup variant="content">
            <UITextField
              error={!field.state.meta.isValid}
              helperText={field.state.meta.errors.join(", ")}
              label={`Item ${props.index + 1}`}
              onBlur={field.handleBlur}
              onChange={(event) => {
                return field.handleChange(event.target.value);
              }}
              value={field.state.value}
            />
            <UIButton onClick={props.remove} type="button" variant="text">
              Remover
            </UIButton>
          </UIContentGroup>
        );
      }}
    </form.Field>
  );
}

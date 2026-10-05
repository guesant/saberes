import { UITextField } from "@guesant/saberes-ui";
import type { StudyChecklistEditorFormApi } from "./study-checklist-editor-form-api.type";

export interface StudyChecklistEditorTitleFieldProps {
  form: StudyChecklistEditorFormApi;
}

export function StudyChecklistEditorTitleField(props: StudyChecklistEditorTitleFieldProps) {
  const { form } = props;

  return (
    <form.Field
      name="content.title"
      validators={{
        onChange: ({ value }) => {
          return value.trim() ? undefined : "Informe um título.";
        },
      }}
    >
      {(field) => {
        return (
          <UITextField
            error={!field.state.meta.isValid}
            helperText={field.state.meta.errors.join(", ")}
            label="Título"
            onBlur={field.handleBlur}
            onChange={(event) => {
              return field.handleChange(event.target.value);
            }}
            value={field.state.value}
          />
        );
      }}
    </form.Field>
  );
}

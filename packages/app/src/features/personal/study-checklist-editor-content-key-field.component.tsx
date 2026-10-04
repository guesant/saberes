import { PersonalContentKeyField } from "./personal-content-key-field.component";
import type { StudyChecklistEditorFormApi } from "./study-checklist-editor-form-api.type";

export interface StudyChecklistEditorContentKeyFieldProps {
  form: StudyChecklistEditorFormApi;
}

export function StudyChecklistEditorContentKeyField(
  props: StudyChecklistEditorContentKeyFieldProps,
) {
  const { form } = props;

  return (
    <form.Field name="content.contentKey">
      {(field) => {
        return (
          <PersonalContentKeyField
            onChange={(value) => {
              return field.handleChange(value);
            }}
            value={field.state.value}
          />
        );
      }}
    </form.Field>
  );
}

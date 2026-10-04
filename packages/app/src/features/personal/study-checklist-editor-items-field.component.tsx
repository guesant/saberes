import { UIButton, UIContentGroup } from "@guesant/saberes-ui";
import { StudyChecklistEditorItemField } from "./study-checklist-editor-item-field.component";
import type { StudyChecklistEditorFormApi } from "./study-checklist-editor-form-api.type";

export interface StudyChecklistEditorItemsFieldProps {
  form: StudyChecklistEditorFormApi;
}

export function StudyChecklistEditorItemsField(props: StudyChecklistEditorItemsFieldProps) {
  const { form } = props;

  return (
    <form.Field mode="array" name="items">
      {(field) => {
        return (
          <UIContentGroup variant="tight">
            {field.state.value.map((_, index) => {
              return (
                <StudyChecklistEditorItemField
                  form={form}
                  index={index}
                  key={field.state.value[index].id}
                  remove={() => {
                    return field.removeValue(index);
                  }}
                />
              );
            })}
            <UIButton
              onClick={() => {
                return field.pushValue({ id: crypto.randomUUID(), label: "" });
              }}
              type="button"
              variant="outlined"
            >
              Adicionar item
            </UIButton>
          </UIContentGroup>
        );
      }}
    </form.Field>
  );
}

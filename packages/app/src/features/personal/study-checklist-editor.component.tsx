import { UIContentGroup, UIForm } from "@guesant/saberes-ui";
import { StudyChecklistEditorActions } from "./study-checklist-editor-actions.component";
import { StudyChecklistEditorContentKeyField } from "./study-checklist-editor-content-key-field.component";
import { StudyChecklistEditorItemsField } from "./study-checklist-editor-items-field.component";
import { StudyChecklistEditorTitleField } from "./study-checklist-editor-title-field.component";
import { useStudyChecklistEditorForm } from "./use-study-checklist-editor-form.hook";
import type { StudyChecklistEditorValues } from "./study-checklist-editor-values.interface";
import type { FormEvent } from "react";

export interface StudyChecklistEditorProps {
  initialValues: StudyChecklistEditorValues;
  onSave(values: StudyChecklistEditorValues): Promise<void>;

  onCancel(): void;
}

export function StudyChecklistEditor(props: StudyChecklistEditorProps) {
  const form = useStudyChecklistEditorForm({
    initialValues: props.initialValues,
    onSave: props.onSave,
  });

  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    event.stopPropagation();

    form.handleSubmit()
      .catch(() => {
        return undefined;
      });
  };

  return (
    <UIContentGroup variant="content">
      <UIForm onSubmit={submit}>
        <StudyChecklistEditorTitleField form={form} />
        <StudyChecklistEditorContentKeyField form={form} />
        <StudyChecklistEditorItemsField form={form} />
        <StudyChecklistEditorActions
          createLabel="Salvar edição"
          form={form}
          onCancel={props.onCancel}
        />
      </UIForm>
    </UIContentGroup>
  );
}

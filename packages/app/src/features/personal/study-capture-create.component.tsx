import { UIForm } from "@guesant/saberes-ui";
import { StudyCaptureCreateFields } from "./study-capture-create-fields.component";
import { useStudyCaptureCreateForm } from "./use-study-capture-create-form.hook";
import type { StudyCaptureCreateHandler } from "./study-capture-create-handler.type";
import type { FormEvent } from "react";

export interface StudyCaptureCreateProps {
  formId: string;
  onCreate: StudyCaptureCreateHandler;
}

export function StudyCaptureCreate(props: StudyCaptureCreateProps) {
  const form = useStudyCaptureCreateForm(props.onCreate);

  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    await form.onCreate();
  };

  return (
    <UIForm id={props.formId} onSubmit={submit}>
      <StudyCaptureCreateFields
        contentKey={form.contentKey}
        description={form.description}
        dueDate={form.dueDate}
        onContentKeyChange={form.onContentKeyChange}
        onDescriptionChange={form.onDescriptionChange}
        onDueDateChange={form.onDueDateChange}
        onTitleChange={form.onTitleChange}
        title={form.title}
      />
    </UIForm>
  );
}

import { StudyCaptureCreateFields } from "./study-capture-create-fields.component";
import { useStudyCaptureCreateForm } from "./use-study-capture-create-form.hook";
import type { StudyCaptureCreateHandler } from "./study-capture-create-handler.type";

export interface StudyCaptureCreateProps {
  onCreate: StudyCaptureCreateHandler;
}

export function StudyCaptureCreate(props: StudyCaptureCreateProps) {
  const form = useStudyCaptureCreateForm(props.onCreate);

  return (
    <StudyCaptureCreateFields
      contentKey={form.contentKey}
      description={form.description}
      dueDate={form.dueDate}
      onContentKeyChange={form.onContentKeyChange}
      onCreate={form.onCreate}
      onDescriptionChange={form.onDescriptionChange}
      onDueDateChange={form.onDueDateChange}
      onTitleChange={form.onTitleChange}
      title={form.title}
    />
  );
}

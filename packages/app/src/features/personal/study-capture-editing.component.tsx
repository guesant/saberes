import { useState } from "react";
import { StudyCaptureEditor } from "./study-capture-editor.component";
import type { StudyCaptureEditingProps } from "./study-capture-editing-props.interface";

export function StudyCaptureEditing(props: StudyCaptureEditingProps) {
  const [title, setTitle] = useState(props.capture.title);

  const [description, setDescription] = useState(props.capture.description);

  const [dueDate, setDueDate] = useState(props.capture.dueDate || "");

  const save = async (): Promise<void> => {
    await props.onSave({
      id: props.capture.id,
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || undefined,
    });
  };

  return (
    <StudyCaptureEditor
      description={description}
      dueDate={dueDate}
      onCancel={props.onCancel}
      onDescriptionChange={setDescription}
      onDueDateChange={setDueDate}
      onSave={save}
      onTitleChange={setTitle}
      title={title}
    />
  );
}

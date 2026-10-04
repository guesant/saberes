import { useState } from "react";
import type { StudyCaptureCreateFieldsProps } from "./study-capture-create-fields-props.interface";
import type { StudyCaptureCreateHandler } from "./study-capture-create-handler.type";
import type { StudyCaptureCreateInput } from "./study-capture-create-input.interface";

export function useStudyCaptureCreateForm(
  onCreate: StudyCaptureCreateHandler,
): StudyCaptureCreateFieldsProps {
  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [contentKey, setContentKey] = useState("");

  const [dueDate, setDueDate] = useState("");

  const create = async (): Promise<void> => {
    if (!title.trim() || !description.trim()) {
      return;
    }

    const input: StudyCaptureCreateInput = {
      title: title.trim(),
      description: description.trim(),
      contentKey: contentKey.trim() || undefined,
      dueDate: dueDate || undefined,
    };

    await onCreate(input);

    setTitle("");

    setDescription("");

    setContentKey("");

    setDueDate("");
  };

  return {
    title,
    description,
    contentKey,
    dueDate,
    onTitleChange: setTitle,
    onDescriptionChange: setDescription,
    onContentKeyChange: setContentKey,
    onDueDateChange: setDueDate,
    onCreate: create,
  };
}

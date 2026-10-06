import { UIForm } from "@guesant/saberes-ui";
import { useState } from "react";
import { getStudyChecklistValues } from "./get-study-checklist-values.function";
import { StudyChecklistCreateFields } from "./study-checklist-create-fields.component";
import type { FormEvent } from "react";

export interface StudyChecklistCreateProps {
  formId: string;
  onCreate(title: string, items: string[], contentKey?: string): Promise<void>;
}

export function StudyChecklistCreate(props: StudyChecklistCreateProps) {
  const [title, setTitle] = useState("");

  const [items, setItems] = useState("");

  const [contentKey, setContentKey] = useState("");

  const create = async (): Promise<void> => {
    const values = getStudyChecklistValues(items);

    if (title.trim() && values.length > 0) {
      await props.onCreate(title.trim(), values, contentKey.trim() || undefined);

      setTitle("");

      setItems("");

      setContentKey("");
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    await create();
  };

  return (
    <UIForm id={props.formId} onSubmit={submit}>
      <StudyChecklistCreateFields
        contentKey={contentKey}
        items={items}
        onContentKeyChange={setContentKey}
        onItemsChange={setItems}
        onTitleChange={setTitle}
        title={title}
      />
    </UIForm>
  );
}

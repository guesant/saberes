import { UIButton, UIContentGroup } from "@guesant/saberes-ui";
import { useState } from "react";
import { getStudyChecklistValues } from "./get-study-checklist-values.function";
import { StudyChecklistCreateFields } from "./study-checklist-create-fields.component";

export interface StudyChecklistCreateProps {
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

  return (
    <UIContentGroup variant="content">
      <StudyChecklistCreateFields
        contentKey={contentKey}
        items={items}
        onContentKeyChange={setContentKey}
        onItemsChange={setItems}
        onTitleChange={setTitle}
        title={title}
      />
      <UIButton
        disabled={!title.trim() || getStudyChecklistValues(items).length === 0}
        onClick={create}
        variant="outlined"
      >
        Salvar checklist
      </UIButton>
    </UIContentGroup>
  );
}

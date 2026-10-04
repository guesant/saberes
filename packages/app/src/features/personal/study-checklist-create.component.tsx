import { UIButton, UIContentGroup, UITextField } from "@guesant/saberes-ui";
import { useState } from "react";
import { getStudyChecklistValues } from "./get-study-checklist-values.function";
import { PersonalContentKeyField } from "./personal-content-key-field.component";

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
    <UIContentGroup variant="tight">
      <UITextField
        label="Título do checklist"
        onChange={(event) => setTitle(event.target.value)}
        value={title}
      />
      <UITextField
        label="Itens, um por linha"
        multiline
        onChange={(event) => setItems(event.target.value)}
        value={items}
      />
      <PersonalContentKeyField onChange={setContentKey} value={contentKey} />
      <UIButton onClick={create} variant="outlined">
        Salvar checklist
      </UIButton>
    </UIContentGroup>
  );
}

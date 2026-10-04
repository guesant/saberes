import { UIButton, UIContentGroup, UITextField } from "@guesant/saberes-ui";
import { useState } from "react";
import { PersonalContentKeyField } from "./personal-content-key-field.component";

export interface PersonalNoteCreateProps {
  onCreate(title: string, body: string, contentKey?: string): Promise<void>;
}

export function PersonalNoteCreate(props: PersonalNoteCreateProps) {
  const [title, setTitle] = useState("");

  const [body, setBody] = useState("");

  const [contentKey, setContentKey] = useState("");

  const create = async (): Promise<void> => {
    if (title.trim() && body.trim()) {
      await props.onCreate(title.trim(), body.trim(), contentKey.trim() || undefined);

      setTitle("");

      setBody("");

      setContentKey("");
    }
  };

  return (
    <UIContentGroup variant="tight">
      <UITextField
        label="Título da nota"
        onChange={(event) => { return setTitle(event.target.value); }}
        value={title}
      />
      <UITextField
        label="Texto da nota"
        multiline
        onChange={(event) => { return setBody(event.target.value); }}
        value={body}
      />
      <PersonalContentKeyField onChange={setContentKey} value={contentKey} />
      <UIButton onClick={create} variant="outlined">
        Salvar nota
      </UIButton>
    </UIContentGroup>
  );
}

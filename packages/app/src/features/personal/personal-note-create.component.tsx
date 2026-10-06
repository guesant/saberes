import { UIForm, UITextField } from "@guesant/saberes-ui";
import { useState } from "react";
import { PersonalContentKeyField } from "./personal-content-key-field.component";
import type { FormEvent } from "react";

export interface PersonalNoteCreateProps {
  formId: string;
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

  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    await create();
  };

  return (
    <UIForm id={props.formId} onSubmit={submit}>
      <UITextField
        label="Título da nota"
        onChange={(event) => {
          return setTitle(event.target.value);
        }}
        required
        value={title}
      />
      <UITextField
        label="Texto da nota"
        multiline
        onChange={(event) => {
          return setBody(event.target.value);
        }}
        required
        value={body}
      />
      <PersonalContentKeyField onChange={setContentKey} value={contentKey} />
    </UIForm>
  );
}

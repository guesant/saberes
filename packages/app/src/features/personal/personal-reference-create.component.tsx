import { UIButton, UIContentGroup, UITextField } from "@guesant/saberes-ui";
import { useState } from "react";
import { PersonalContentKeyField } from "./personal-content-key-field.component";

export interface PersonalReferenceCreateProps {
  onCreate(title: string, source: string, contentKey?: string): Promise<void>;
}

export function PersonalReferenceCreate(props: PersonalReferenceCreateProps) {
  const [title, setTitle] = useState("");

  const [source, setSource] = useState("");

  const [contentKey, setContentKey] = useState("");

  const create = async (): Promise<void> => {
    if (title.trim() && source.trim()) {
      await props.onCreate(title.trim(), source.trim(), contentKey.trim() || undefined);

      setTitle("");

      setSource("");

      setContentKey("");
    }
  };

  return (
    <UIContentGroup variant="tight">
      <UITextField
        label="Título da referência"
        onChange={(event) => setTitle(event.target.value)}
        value={title}
      />
      <UITextField
        label="Fonte ou endereço"
        onChange={(event) => setSource(event.target.value)}
        value={source}
      />
      <PersonalContentKeyField onChange={setContentKey} value={contentKey} />
      <UIButton onClick={create} variant="outlined">
        Salvar referência
      </UIButton>
    </UIContentGroup>
  );
}

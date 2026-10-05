import { UIButton, UIContentGroup } from "@guesant/saberes-ui";
import { useState } from "react";
import { PersonalReferenceCreateFields } from "./personal-reference-create-fields.component";

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
    <UIContentGroup variant="content">
      <PersonalReferenceCreateFields
        contentKey={contentKey}
        onContentKeyChange={setContentKey}
        onSourceChange={setSource}
        onTitleChange={setTitle}
        source={source}
        title={title}
      />
      <UIButton disabled={!title.trim() || !source.trim()} onClick={create} variant="outlined">
        Salvar referência
      </UIButton>
    </UIContentGroup>
  );
}

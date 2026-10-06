import { UIForm } from "@guesant/saberes-ui";
import { useState } from "react";
import { PersonalReferenceCreateFields } from "./personal-reference-create-fields.component";
import type { FormEvent } from "react";

export interface PersonalReferenceCreateProps {
  formId: string;
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

  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    await create();
  };

  return (
    <UIForm id={props.formId} onSubmit={submit}>
      <PersonalReferenceCreateFields
        contentKey={contentKey}
        onContentKeyChange={setContentKey}
        onSourceChange={setSource}
        onTitleChange={setTitle}
        source={source}
        title={title}
      />
    </UIForm>
  );
}

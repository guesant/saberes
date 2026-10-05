import { useState } from "react";
import { PersonalReferenceDisplay } from "./personal-reference-display.component";
import { PersonalReferenceEditor } from "./personal-reference-editor.component";
import type { PersonalEntitySelection } from "./personal-entity-selection.interface";
import type { PersonalReference } from "@guesant/saberes-application";

export interface PersonalReferenceItemProps {
  selection: PersonalEntitySelection;
  reference: PersonalReference;
  onUpdateFavorite(id: string): Promise<void>;

  onDelete(id: string): Promise<void>;

  onUpdateContent(id: string, title: string, source: string): Promise<void>;
}

export function PersonalReferenceItem(props: PersonalReferenceItemProps) {
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState(props.reference.title);

  const [source, setSource] = useState(props.reference.source);

  const save = async (): Promise<void> => {
    await props.onUpdateContent(props.reference.id, title.trim(), source.trim());

    setEditing(false);
  };

  if (editing) {
    return (
      <PersonalReferenceEditor
        onCancel={() => { return setEditing(false); }}
        onSave={save}
        onSourceChange={setSource}
        onTitleChange={setTitle}
        source={source}
        title={title}
      />
    );
  }

  return (
    <PersonalReferenceDisplay
      reference={props.reference}
      onDelete={() => { return props.onDelete(props.reference.id); }}
      onEdit={() => { return setEditing(true); }}
      onFavorite={() => { return props.onUpdateFavorite(props.reference.id); }}
      onSelect={props.selection.select}
      selected={props.selection.isSelected({ id: props.reference.id, recordType: "reference" })}
    />
  );
}

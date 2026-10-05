import { useState } from "react";
import { createStudyCaptureSaveAction } from "./create-study-capture-save-action.function";
import { StudyCaptureDisplay } from "./study-capture-display.component";
import { StudyCaptureEditing } from "./study-capture-editing.component";
import type { PersonalEntitySelection } from "./personal-entity-selection.interface";
import type { StudyCaptureContentInput } from "./study-capture-content-input.interface";
import type { StudyCapture } from "@guesant/saberes-application";

export interface StudyCaptureItemProps {
  selection: PersonalEntitySelection;
  capture: StudyCapture;

  onUpdateCompletion(id: string): Promise<void>;

  onUpdateArchive(id: string): Promise<void>;

  onDelete(id: string): Promise<void>;

  onUpdateContent(input: StudyCaptureContentInput): Promise<void>;
}

export function StudyCaptureItem(props: StudyCaptureItemProps) {
  const [editing, setEditing] = useState(false);

  const save = createStudyCaptureSaveAction({ onUpdateContent: props.onUpdateContent, setEditing });

  if (editing) {
    return (
      <StudyCaptureEditing
        capture={props.capture}
        onCancel={() => {
          return setEditing(false);
        }}
        onSave={save}
      />
    );
  }

  return (
    <StudyCaptureDisplay
      capture={props.capture}
      onArchive={() => {
        return props.onUpdateArchive(props.capture.id);
      }}
      onDelete={() => {
        return props.onDelete(props.capture.id);
      }}
      onEdit={() => {
        return setEditing(true);
      }}
      onUpdateCompletion={() => {
        return props.onUpdateCompletion(props.capture.id);
      }}
      onSelect={props.selection.select}
      selected={props.selection.isSelected({ id: props.capture.id, recordType: "capture" })}
    />
  );
}

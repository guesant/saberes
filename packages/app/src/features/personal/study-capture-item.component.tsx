import { useState } from "react";
import { StudyCaptureDisplay } from "./study-capture-display.component";
import { StudyCaptureEditing } from "./study-capture-editing.component";
import type { StudyCaptureContentInput } from "./study-capture-content-input.interface";
import type { StudyCapture } from "@guesant/saberes-application";

export interface StudyCaptureItemProps {
  capture: StudyCapture;

  onUpdateCompletion(id: string): Promise<void>;

  onUpdateArchive(id: string): Promise<void>;

  onDelete(id: string): Promise<void>;

  onUpdateContent(input: StudyCaptureContentInput): Promise<void>;
}

export function StudyCaptureItem(props: StudyCaptureItemProps) {
  const [editing, setEditing] = useState(false);

  const save = async (input: StudyCaptureContentInput): Promise<void> => {
    await props.onUpdateContent(input);

    setEditing(false);
  };

  if (editing) {
    return (
      <StudyCaptureEditing
        capture={props.capture}
        onCancel={() => setEditing(false)}
        onSave={save}
      />
    );
  }

  return (
    <StudyCaptureDisplay
      capture={props.capture}
      onArchive={() => props.onUpdateArchive(props.capture.id)}
      onDelete={() => props.onDelete(props.capture.id)}
      onEdit={() => setEditing(true)}
      onUpdateCompletion={() => props.onUpdateCompletion(props.capture.id)}
    />
  );
}

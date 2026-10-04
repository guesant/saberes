import { createStudyChecklistEditorValues } from "./create-study-checklist-editor-values.function";
import { saveStudyChecklistEditorValues } from "./save-study-checklist-editor-values.function";
import { StudyChecklistDisplay } from "./study-checklist-display.component";
import { StudyChecklistEditor } from "./study-checklist-editor.component";
import { useStudyChecklistEditingState } from "./use-study-checklist-editing-state.hook";
import type { StudyChecklistEditorValues } from "./study-checklist-editor-values.interface";
import type { UpdateStudyChecklistContentActionInput } from "./update-study-checklist-content-action-input.interface";
import type { StudyChecklist } from "@guesant/saberes-application";

export interface StudyChecklistViewItemProps {
  checklist: StudyChecklist;
  onUpdateItem(checklistId: string, itemId: string): Promise<void>;

  onMoveItem(checklistId: string, itemId: string, direction: "down" | "up"): Promise<void>;

  onUpdateContent(input: UpdateStudyChecklistContentActionInput): Promise<void>;

  onDelete(id: string): Promise<void>;
}

export function StudyChecklistViewItem(props: StudyChecklistViewItemProps) {
  const editor = useStudyChecklistEditingState(props.checklist);

  const save = (values: StudyChecklistEditorValues) =>
    saveStudyChecklistEditorValues({
      id: props.checklist.id,
      onSaved: () => editor.setEditing(false),
      onUpdateContent: props.onUpdateContent,
      values,
    });

  if (editor.editing) {
    return (
      <StudyChecklistEditor
        initialValues={createStudyChecklistEditorValues(props.checklist)}
        onCancel={() => editor.setEditing(false)}
        onSave={save}
      />
    );
  }

  return (
    <StudyChecklistDisplay
      checklist={props.checklist}
      onDelete={() => props.onDelete(props.checklist.id)}
      onEdit={() => editor.setEditing(true)}
      onMoveItem={props.onMoveItem}
      onUpdateItem={props.onUpdateItem}
    />
  );
}

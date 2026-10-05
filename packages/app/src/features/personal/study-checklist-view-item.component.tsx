import { createStudyChecklistEditorValues } from "./create-study-checklist-editor-values.function";
import { saveStudyChecklistEditorValues } from "./save-study-checklist-editor-values.function";
import { StudyChecklistDisplay } from "./study-checklist-display.component";
import { StudyChecklistEditor } from "./study-checklist-editor.component";
import { useStudyChecklistEditingState } from "./use-study-checklist-editing-state.hook";
import type { PersonalEntitySelection } from "./personal-entity-selection.interface";
import type { StudyChecklistEditorValues } from "./study-checklist-editor-values.interface";
import type { UpdateStudyChecklistContentActionInput } from "./update-study-checklist-content-action-input.interface";
import type { StudyChecklist } from "@guesant/saberes-application";

export interface StudyChecklistViewItemProps {
  selection: PersonalEntitySelection;
  checklist: StudyChecklist;
  onUpdateItem(checklistId: string, itemId: string): Promise<void>;

  onMoveItem(checklistId: string, itemId: string, direction: "down" | "up"): Promise<void>;

  onUpdateContent(input: UpdateStudyChecklistContentActionInput): Promise<void>;

  onDelete(id: string): Promise<void>;
}

export function StudyChecklistViewItem(props: StudyChecklistViewItemProps) {
  const editor = useStudyChecklistEditingState(props.checklist);

  const save = (values: StudyChecklistEditorValues) => {
    return saveStudyChecklistEditorValues({
      id: props.checklist.id,
      onSaved: () => { return editor.setEditing(false); },
      onUpdateContent: props.onUpdateContent,
      values,
    });
  };

  if (editor.editing) {
    return (
      <StudyChecklistEditor
        initialValues={createStudyChecklistEditorValues(props.checklist)}
        onCancel={() => { return editor.setEditing(false); }}
        onSave={save}
      />
    );
  }

  return (
    <StudyChecklistDisplay
      checklist={props.checklist}
      onSelect={props.selection.select}
      selected={props.selection.isSelected({ id: props.checklist.id, recordType: "checklist" })}
      onDelete={() => { return props.onDelete(props.checklist.id); }}
      onEdit={() => { return editor.setEditing(true); }}
      onMoveItem={props.onMoveItem}
      onUpdateItem={props.onUpdateItem}
    />
  );
}

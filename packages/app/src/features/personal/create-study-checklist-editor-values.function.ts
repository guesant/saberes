import type { StudyChecklistEditorValues } from "./study-checklist-editor-values.interface";
import type { StudyChecklist } from "@guesant/saberes-application";

export function createStudyChecklistEditorValues(
  checklist: StudyChecklist,
): StudyChecklistEditorValues {
  return {
    content: { contentKey: checklist.contentKey ?? "", title: checklist.title },
    items: checklist.items.map((item) => {
      return { id: item.id, label: item.label };
    }),
  };
}

import type { SaveStudyChecklistContentAction } from "./save-study-checklist-content-action.interface";
import type { SaveStudyChecklistContentInput } from "./save-study-checklist-content-input.interface";

export function createSaveStudyChecklistContentAction(
  input: SaveStudyChecklistContentInput,
): SaveStudyChecklistContentAction {
  const save = async (): Promise<void> => {
    if (input.title.trim() && input.items.trim()) {
      await input.onUpdateContent({
        contentKey: input.contentKey.trim() || undefined,
        id: input.id,
        items: input.items,
        title: input.title.trim(),
      });

      input.onSaved();
    }
  };

  return save;
}

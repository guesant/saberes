import type { SaveStudyChecklistEditorValuesInput } from "./save-study-checklist-editor-values-input.interface";

export async function saveStudyChecklistEditorValues(
  input: SaveStudyChecklistEditorValuesInput,
): Promise<void> {
  const items = input.values.items
    .map((item) => {
      return item.label.trim();
    })
    .filter((item) => {
      return item.length > 0;
    })
    .join("\n");

  if (!input.values.content.title.trim() || !items) {
    return;
  }

  await input.onUpdateContent({
    contentKey: input.values.content.contentKey.trim() || undefined,
    id: input.id,
    items,
    title: input.values.content.title.trim(),
  });

  input.onSaved();
}

import { useForm } from "@tanstack/react-form";
import type { StudyChecklistEditorFormOptions } from "./study-checklist-editor-form-options.interface";

export function useStudyChecklistEditorForm(options: StudyChecklistEditorFormOptions) {
  return useForm({
    defaultValues: options.initialValues,
    onSubmit: async ({ value }): Promise<void> => {
      await options.onSave(value);
    },
  });
}

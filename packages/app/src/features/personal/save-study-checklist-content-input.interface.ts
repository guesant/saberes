import type { UpdateStudyChecklistContentActionInput } from "./update-study-checklist-content-action-input.interface";

export interface SaveStudyChecklistContentInput {
  contentKey: string;

  id: string;

  items: string;

  onSaved(): void;

  onUpdateContent(input: UpdateStudyChecklistContentActionInput): Promise<void>;

  title: string;
}

import { useCreatePersonalNote } from "./use-create-personal-note.hook";
import { useCreatePersonalReference } from "./use-create-personal-reference.hook";
import { useCreateStudyCapture } from "./use-create-study-capture.hook";
import { useCreateStudyChecklist } from "./use-create-study-checklist.hook";
import type { PersonalWorkspaceActionsInput } from "./personal-workspace-actions-input.interface";
import type { PersonalWorkspaceViewModel } from "./personal-workspace-view-model.interface";

export function createPersonalWorkspaceCreationActions(
  input: PersonalWorkspaceActionsInput,
): Pick<
  PersonalWorkspaceViewModel,
  "createNote" | "createChecklist" | "createCapture" | "createReference"
> {
  return {
    createNote: useCreatePersonalNote(input.workspace, input.save, input.generateId),
    createChecklist: useCreateStudyChecklist(input.workspace, input.save, input.generateId),
    createCapture: useCreateStudyCapture(input.workspace, input.save, input.generateId),
    createReference: useCreatePersonalReference(input.workspace, input.save, input.generateId),
  };
}

import { createPersonalWorkspaceCreationActions } from "./create-personal-workspace-creation-actions.function";
import { createPersonalWorkspaceLensActions } from "./create-personal-workspace-lens-actions.function";
import { createPersonalWorkspaceUpdateActions } from "./create-personal-workspace-update-actions.function";
import type { PersonalWorkspaceActionsInput } from "./personal-workspace-actions-input.interface";
import type { PersonalWorkspaceViewModel } from "./personal-workspace-view-model.interface";

export function createPersonalWorkspaceActions(
  input: PersonalWorkspaceActionsInput,
): Pick<
  PersonalWorkspaceViewModel,
  | "createNote"
  | "createChecklist"
  | "createCapture"
  | "createReference"
  | "updateNote"
  | "updateChecklistItem"
  | "moveChecklistItem"
  | "updateChecklistContent"
  | "updateCaptureCompletion"
  | "updateCaptureArchive"
  | "updateReferenceFavorite"
  | "deleteNote"
  | "deleteChecklist"
  | "deleteCapture"
  | "deleteReference"
  | "restoreNote"
  | "restoreChecklist"
  | "restoreCapture"
  | "restoreReference"
  | "updateNoteContent"
  | "updateCaptureContent"
  | "updateReferenceContent"
  | "saveLens"
  | "deleteLens"
> {
  return {
    ...createPersonalWorkspaceCreationActions(input),
    ...createPersonalWorkspaceLensActions(input),
    ...createPersonalWorkspaceUpdateActions(input),
  };
}

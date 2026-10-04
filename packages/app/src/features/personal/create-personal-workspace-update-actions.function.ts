import { createPersonalNoteContentUpdateAction } from "./create-personal-note-content-update-action.function";
import { createPersonalNoteUpdateAction } from "./create-personal-note-update-action.function";
import { createPersonalReferenceContentUpdateAction } from "./create-personal-reference-content-update-action.function";
import { createPersonalReferenceFavoriteUpdateAction } from "./create-personal-reference-favorite-update-action.function";
import { createPersonalWorkspaceLifecycleActions } from "./create-personal-workspace-lifecycle-actions.function";
import { createStudyCaptureArchiveUpdateAction } from "./create-study-capture-archive-update-action.function";
import { createStudyCaptureCompletionUpdateAction } from "./create-study-capture-completion-update-action.function";
import { createStudyCaptureContentUpdateAction } from "./create-study-capture-content-update-action.function";
import { createStudyChecklistContentUpdateAction } from "./create-study-checklist-content-update-action.function";
import { createStudyChecklistItemMoveAction } from "./create-study-checklist-item-move-action.function";
import { createStudyChecklistItemUpdateAction } from "./create-study-checklist-item-update-action.function";
import type { PersonalWorkspaceActionsInput } from "./personal-workspace-actions-input.interface";
import type { PersonalWorkspaceUpdateActions } from "./personal-workspace-update-actions.type";

export function createPersonalWorkspaceUpdateActions(
  input: PersonalWorkspaceActionsInput,
): PersonalWorkspaceUpdateActions {
  return {
    ...createPersonalWorkspaceLifecycleActions(input),
    updateNote: createPersonalNoteUpdateAction(input),
    updateChecklistItem: createStudyChecklistItemUpdateAction(input),
    moveChecklistItem: createStudyChecklistItemMoveAction(input),
    updateChecklistContent: createStudyChecklistContentUpdateAction(input),
    updateCaptureCompletion: createStudyCaptureCompletionUpdateAction(input),
    updateCaptureArchive: createStudyCaptureArchiveUpdateAction(input),
    updateReferenceFavorite: createPersonalReferenceFavoriteUpdateAction(input),
    updateNoteContent: createPersonalNoteContentUpdateAction(input),
    updateCaptureContent: createStudyCaptureContentUpdateAction(input),
    updateReferenceContent: createPersonalReferenceContentUpdateAction(input),
  };
}

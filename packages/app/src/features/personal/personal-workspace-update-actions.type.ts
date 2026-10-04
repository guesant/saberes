import type { PersonalWorkspaceViewModel } from "./personal-workspace-view-model.interface";

export type PersonalWorkspaceUpdateActions = Pick<
  PersonalWorkspaceViewModel,
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
>;

import { deletePersonalNote } from "./delete-personal-note.function";
import { deletePersonalReference } from "./delete-personal-reference.function";
import { deleteStudyCapture } from "./delete-study-capture.function";
import { deleteStudyChecklist } from "./delete-study-checklist.function";
import { restorePersonalNote } from "./restore-personal-note.function";
import { restorePersonalReference } from "./restore-personal-reference.function";
import { restoreStudyCapture } from "./restore-study-capture.function";
import { restoreStudyChecklist } from "./restore-study-checklist.function";
import type { PersonalWorkspaceActionsInput } from "./personal-workspace-actions-input.interface";
import type { PersonalWorkspaceViewModel } from "./personal-workspace-view-model.interface";

export function createPersonalWorkspaceLifecycleActions(
  input: PersonalWorkspaceActionsInput,
): Pick<
  PersonalWorkspaceViewModel,
  | "deleteNote"
  | "deleteChecklist"
  | "deleteCapture"
  | "deleteReference"
  | "restoreNote"
  | "restoreChecklist"
  | "restoreCapture"
  | "restoreReference"
> {
  return {
    deleteNote: async (id: string): Promise<void> => { return input.save(deletePersonalNote(input.workspace, id)); },
    deleteChecklist: async (id: string): Promise<void> => { return input.save(deleteStudyChecklist(input.workspace, id)); },
    deleteCapture: async (id: string): Promise<void> => { return input.save(deleteStudyCapture(input.workspace, id)); },
    deleteReference: async (id: string): Promise<void> => { return input.save(deletePersonalReference(input.workspace, id)); },
    restoreNote: async (id: string): Promise<void> => { return input.save(restorePersonalNote(input.workspace, id)); },
    restoreChecklist: async (id: string): Promise<void> => { return input.save(restoreStudyChecklist(input.workspace, id)); },
    restoreCapture: async (id: string): Promise<void> => { return input.save(restoreStudyCapture(input.workspace, id)); },
    restoreReference: async (id: string): Promise<void> => { return input.save(restorePersonalReference(input.workspace, id)); },
  };
}

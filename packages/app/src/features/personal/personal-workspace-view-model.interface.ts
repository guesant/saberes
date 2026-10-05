import type { SavePersonalLensInput } from "./save-personal-lens-input.interface";
import type { StudyCaptureContentInput } from "./study-capture-content-input.interface";
import type { StudyCaptureCreateInput } from "./study-capture-create-input.interface";
import type { UpdatePersonalNoteContentActionInput } from "./update-personal-note-content-action-input.interface";
import type { UpdateStudyChecklistContentActionInput } from "./update-study-checklist-content-action-input.interface";
import type { PersonalWorkspace ,
  PersonalRelationEndpoint,
  PersonalRelationKind,
} from "@guesant/saberes-application";

export interface PersonalWorkspaceViewModel {
  state: "loading" | "error" | "ready";
  workspace: PersonalWorkspace;
  error: Error | null;
  saveError: Error | null;
  createNote(title: string, body: string, contentKey?: string): Promise<void>;

  createChecklist(title: string, items: string[], contentKey?: string): Promise<void>;

  createCapture(input: StudyCaptureCreateInput): Promise<void>;

  createReference(title: string, source: string, contentKey?: string): Promise<void>;

  updateNote(id: string): Promise<void>;

  updateChecklistItem(checklistId: string, itemId: string): Promise<void>;

  moveChecklistItem(checklistId: string, itemId: string, direction: "down" | "up"): Promise<void>;

  updateChecklistContent(input: UpdateStudyChecklistContentActionInput): Promise<void>;

  updateCaptureCompletion(id: string): Promise<void>;

  updateCaptureArchive(id: string): Promise<void>;

  updateReferenceFavorite(id: string): Promise<void>;

  deleteNote(id: string): Promise<void>;

  deleteChecklist(id: string): Promise<void>;

  deleteCapture(id: string): Promise<void>;

  deleteReference(id: string): Promise<void>;

  restoreNote(id: string): Promise<void>;

  restoreChecklist(id: string): Promise<void>;

  restoreCapture(id: string): Promise<void>;

  restoreReference(id: string): Promise<void>;

  updateNoteContent(input: UpdatePersonalNoteContentActionInput): Promise<void>;

  updateCaptureContent(input: StudyCaptureContentInput): Promise<void>;

  updateReferenceContent(id: string, title: string, source: string): Promise<void>;

  saveLens(input: SavePersonalLensInput): Promise<void>;

  createRelation(
    kind: PersonalRelationKind,
    source: PersonalRelationEndpoint,
    target: PersonalRelationEndpoint,
  ): Promise<void>;

  archiveRelation(id: string): Promise<void>;

  restoreRelation(id: string): Promise<void>;

  reload(): Promise<void>;
}

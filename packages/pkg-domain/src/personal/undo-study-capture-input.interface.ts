import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export interface UndoStudyCaptureInput {
  workspace: PersonalWorkspace;
  id: string;
  completed: boolean;
  archived: boolean;
  dueDate?: string;
  now: string;
}

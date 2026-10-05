import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export interface PostponeStudyCaptureInput {
  workspace: PersonalWorkspace;
  id: string;
  dueDate: string;
  now: string;
}

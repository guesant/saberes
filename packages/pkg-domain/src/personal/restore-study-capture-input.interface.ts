import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export interface RestoreStudyCaptureInput {
  workspace: PersonalWorkspace;
  id: string;
  now: string;
}

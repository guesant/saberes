import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export interface CompleteStudyCaptureInput {
  workspace: PersonalWorkspace;
  id: string;
  now: string;
}

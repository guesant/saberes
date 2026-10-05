import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export interface ArchiveStudyCaptureInput {
  workspace: PersonalWorkspace;
  id: string;
  now: string;
}

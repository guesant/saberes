import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export interface ArchivePersonalRelationInput {
  id: string;
  now: string;
  workspace: PersonalWorkspace;
}

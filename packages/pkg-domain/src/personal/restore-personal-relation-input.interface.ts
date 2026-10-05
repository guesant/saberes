import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export interface RestorePersonalRelationInput {
  id: string;
  now: string;
  workspace: PersonalWorkspace;
}

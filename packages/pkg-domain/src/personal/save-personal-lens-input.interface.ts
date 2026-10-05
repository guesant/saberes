import type { PersonalLens } from "../models/personal-lens.interface";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export interface SavePersonalLensInput {
  lens: PersonalLens;
  workspace: PersonalWorkspace;
}

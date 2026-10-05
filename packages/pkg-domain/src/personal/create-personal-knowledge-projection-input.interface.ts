import type { PersonalLensView } from "../models/personal-lens-view.type";
import type { PersonalLens } from "../models/personal-lens.interface";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export interface CreatePersonalKnowledgeProjectionInput {
  lens?: PersonalLens;
  view?: PersonalLensView;
  workspace: PersonalWorkspace;
}

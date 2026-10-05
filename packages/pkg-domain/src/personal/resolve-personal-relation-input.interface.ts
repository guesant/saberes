import type { PersonalRelation } from "../models/personal-relation.interface";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export interface ResolvePersonalRelationInput {
  availableRecordIds: string[];
  importedRecordIds?: string[];
  relation: PersonalRelation;
  workspace: PersonalWorkspace;
}

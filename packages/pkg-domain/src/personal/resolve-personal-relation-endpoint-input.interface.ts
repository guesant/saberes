import type { PersonalRelationEndpoint } from "../models/personal-relation-endpoint.interface";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export interface ResolvePersonalRelationEndpointInput {
  availableRecordIds: string[];
  endpoint: PersonalRelationEndpoint;
  importedRecordIds: string[];
  workspace: PersonalWorkspace;
}

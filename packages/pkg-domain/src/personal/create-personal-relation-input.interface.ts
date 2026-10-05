import type { PersonalRelationEndpoint } from "../models/personal-relation-endpoint.interface";
import type { PersonalRelationKind } from "../models/personal-relation-kind.type";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export interface CreatePersonalRelationInput {
  id: string;
  kind: PersonalRelationKind;
  now: string;
  source: PersonalRelationEndpoint;
  target: PersonalRelationEndpoint;
  workspace: PersonalWorkspace;
}

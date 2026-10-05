import type { PersonalRelationEndpointResolution } from "./personal-relation-endpoint-resolution.interface";
import type { PersonalRelationResolutionState } from "./personal-relation-resolution-state.type";
import type { PersonalRelation } from "./personal-relation.interface";

export interface PersonalRelationResolution {
  relation: PersonalRelation;
  source: PersonalRelationEndpointResolution;
  state: PersonalRelationResolutionState;
  target: PersonalRelationEndpointResolution;
}

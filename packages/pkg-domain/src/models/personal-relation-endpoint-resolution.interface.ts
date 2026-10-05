import type { PersonalRelationEndpointResolutionStatus } from "./personal-relation-endpoint-resolution-status.type";
import type { PersonalRelationEndpoint } from "./personal-relation-endpoint.interface";

export interface PersonalRelationEndpointResolution {
  endpoint: PersonalRelationEndpoint;
  status: PersonalRelationEndpointResolutionStatus;
}

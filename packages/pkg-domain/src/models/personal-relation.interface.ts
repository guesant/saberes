import type { PersonalRelationEndpoint } from "./personal-relation-endpoint.interface";
import type { PersonalRelationKind } from "./personal-relation-kind.type";

export interface PersonalRelation {
  id: string;
  kind: PersonalRelationKind;
  source: PersonalRelationEndpoint;
  target: PersonalRelationEndpoint;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

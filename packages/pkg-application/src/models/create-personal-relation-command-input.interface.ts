import type {
  PersonalRelationEndpoint,
  PersonalRelationKind,
} from "@guesant/saberes-domain";

export interface CreatePersonalRelationCommandInput {
  id: string;
  kind: PersonalRelationKind;
  now: string;
  source: PersonalRelationEndpoint;
  target: PersonalRelationEndpoint;
}

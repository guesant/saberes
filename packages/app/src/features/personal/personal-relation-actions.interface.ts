import type {
  PersonalRelationEndpoint,
  PersonalRelationKind,
} from "@guesant/saberes-application";

export interface PersonalRelationActions {
  archiveRelation(id: string): Promise<void>;

  createRelation(
    kind: PersonalRelationKind,
    source: PersonalRelationEndpoint,
    target: PersonalRelationEndpoint,
  ): Promise<void>;

  restoreRelation(id: string): Promise<void>;
}

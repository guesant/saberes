import type {
  PersonalRelation,
  PersonalRelationEndpoint,
  PersonalRelationKind,
} from "@guesant/saberes-application";

export interface PersonalRelationsSectionProps {
  relations: PersonalRelation[];
  onArchive(id: string): Promise<void>;

  onCreate(
    kind: PersonalRelationKind,
    source: PersonalRelationEndpoint,
    target: PersonalRelationEndpoint,
  ): Promise<void>;

  onRestore(id: string): Promise<void>;
}

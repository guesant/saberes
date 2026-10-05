import type {
  PersonalRelationEndpoint,
  PersonalRelationKind,
} from "@guesant/saberes-application";

export interface PersonalRelationComposerProps {
  onCreate(
    kind: PersonalRelationKind,
    source: PersonalRelationEndpoint,
    target: PersonalRelationEndpoint,
  ): Promise<void>;
}

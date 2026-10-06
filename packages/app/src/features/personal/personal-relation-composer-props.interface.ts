import type { PersonalRelationOption } from "./use-personal-relation-options.hook";
import type {
  PersonalRelationEndpoint,
  PersonalRelationKind,
} from "@guesant/saberes-application";

export interface PersonalRelationComposerProps {
  options: PersonalRelationOption[];
  onCreate(
    kind: PersonalRelationKind,
    source: PersonalRelationEndpoint,
    target: PersonalRelationEndpoint,
  ): Promise<void>;
}

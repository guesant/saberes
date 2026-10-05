import type { PersonalRelationKind } from "@guesant/saberes-application";

export interface PersonalRelationKindSelectorProps {
  value: PersonalRelationKind;
  onChange(value: PersonalRelationKind): void;
}

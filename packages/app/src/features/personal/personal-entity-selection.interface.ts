import type { PersonalRelationEndpoint } from "@guesant/saberes-application";

export interface PersonalEntitySelection {
  selected: PersonalRelationEndpoint | undefined;
  clear(): void;

  isSelected(endpoint: PersonalRelationEndpoint): boolean;

  select(endpoint: PersonalRelationEndpoint): void;
}

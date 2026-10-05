import type { PersonalRelationContextFilter } from "./personal-relation-context-filter.type";

export interface PersonalRelationContextFilterControlsProps {
  value: PersonalRelationContextFilter;
  onChange(value: PersonalRelationContextFilter): void;
}

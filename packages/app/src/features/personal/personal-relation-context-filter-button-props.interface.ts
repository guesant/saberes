import type { PersonalRelationContextFilterOption } from "./personal-relation-context-filter-option.interface";

export interface PersonalRelationContextFilterButtonProps {
  option: PersonalRelationContextFilterOption;
  selected: boolean;
  onSelect(value: PersonalRelationContextFilterOption["value"]): void;
}

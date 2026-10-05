import { UIInlineActions } from "@guesant/saberes-ui";
import { PersonalRelationContextFilterButton } from "./personal-relation-context-filter-button.component";
import type { PersonalRelationContextFilterControlsProps } from "./personal-relation-context-filter-controls-props.interface";
import type { PersonalRelationContextFilterOption } from "./personal-relation-context-filter-option.interface";

const filters: PersonalRelationContextFilterOption[] = [
  { value: "all", label: "Todas" },
  { value: "note", label: "Notas" },
  { value: "topic", label: "Tópicos" },
  { value: "reference", label: "Materiais" },
];

export function PersonalRelationContextFilterControls(
  props: PersonalRelationContextFilterControlsProps,
) {
  return (
    <UIInlineActions aria-label="Filtrar relações por contexto">
      {filters.map((filter) => {
        return (
          <PersonalRelationContextFilterButton
            key={filter.value}
            onSelect={props.onChange}
            option={filter}
            selected={props.value === filter.value}
          />
        );
      })}
    </UIInlineActions>
  );
}

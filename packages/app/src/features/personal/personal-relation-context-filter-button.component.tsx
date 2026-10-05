import { UIButton } from "@guesant/saberes-ui";
import type { PersonalRelationContextFilterButtonProps } from "./personal-relation-context-filter-button-props.interface";

export function PersonalRelationContextFilterButton(props: PersonalRelationContextFilterButtonProps) {
  return (
    <UIButton
      aria-pressed={props.selected}
      onClick={() => { props.onSelect(props.option.value); }}
      variant={props.selected ? "contained" : "text"}
    >
      {props.option.label}
    </UIButton>
  );
}

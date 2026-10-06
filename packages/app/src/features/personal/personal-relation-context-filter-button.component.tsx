import { UIChoiceButton } from "@guesant/saberes-ui";
import type { PersonalRelationContextFilterButtonProps } from "./personal-relation-context-filter-button-props.interface";

export function PersonalRelationContextFilterButton(
  props: PersonalRelationContextFilterButtonProps,
) {
  return (
    <UIChoiceButton
      aria-pressed={props.selected}
      fullWidth
      onClick={() => {
        props.onSelect(props.option.value);
      }}
      variant={props.selected ? "contained" : "text"}
    >
      {props.option.label}
    </UIChoiceButton>
  );
}

import { UIChoiceButton, UIInlineActions } from "@guesant/saberes-ui";
import type { PersonalRelationKindSelectorProps } from "./personal-relation-kind-selector-props.interface";

export function PersonalRelationKindSelector(props: PersonalRelationKindSelectorProps) {
  return (
    <UIInlineActions>
      <UIChoiceButton
        aria-pressed={props.value === "anchor"}
        onClick={() => {return props.onChange("anchor");}}
        variant={props.value === "anchor" ? "contained" : "outlined"}
      >
        Âncora
      </UIChoiceButton>
      <UIChoiceButton
        aria-pressed={props.value === "backlink"}
        onClick={() => {return props.onChange("backlink");}}
        variant={props.value === "backlink" ? "contained" : "outlined"}
      >
        Backlink
      </UIChoiceButton>
      <UIChoiceButton
        aria-pressed={props.value === "supports"}
        onClick={() => {return props.onChange("supports");}}
        variant={props.value === "supports" ? "contained" : "outlined"}
      >
        Apoia
      </UIChoiceButton>
      <UIChoiceButton
        aria-pressed={props.value === "depends-on"}
        onClick={() => {return props.onChange("depends-on");}}
        variant={props.value === "depends-on" ? "contained" : "outlined"}
      >
        Depende de
      </UIChoiceButton>
    </UIInlineActions>
  );
}

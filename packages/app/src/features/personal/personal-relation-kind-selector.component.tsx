import { UIButton, UIInlineActions } from "@guesant/saberes-ui";
import type { PersonalRelationKindSelectorProps } from "./personal-relation-kind-selector-props.interface";

export function PersonalRelationKindSelector(props: PersonalRelationKindSelectorProps) {
  return (
    <UIInlineActions>
      <UIButton
        aria-pressed={props.value === "anchor"}
        onClick={() => {return props.onChange("anchor");}}
        variant={props.value === "anchor" ? "contained" : "outlined"}
      >
        Âncora
      </UIButton>
      <UIButton
        aria-pressed={props.value === "backlink"}
        onClick={() => {return props.onChange("backlink");}}
        variant={props.value === "backlink" ? "contained" : "outlined"}
      >
        Backlink
      </UIButton>
      <UIButton
        aria-pressed={props.value === "supports"}
        onClick={() => {return props.onChange("supports");}}
        variant={props.value === "supports" ? "contained" : "outlined"}
      >
        Apoia
      </UIButton>
      <UIButton
        aria-pressed={props.value === "depends-on"}
        onClick={() => {return props.onChange("depends-on");}}
        variant={props.value === "depends-on" ? "contained" : "outlined"}
      >
        Depende de
      </UIButton>
    </UIInlineActions>
  );
}

import { UIChoiceButton, UIGrid } from "@guesant/saberes-ui";
import type { PersonalRelationKindSelectorProps } from "./personal-relation-kind-selector-props.interface";

export function PersonalRelationKindSelector(props: PersonalRelationKindSelectorProps) {
  return (
    <UIGrid aria-label="Tipo de relação" columns={2} role="group">
      <UIChoiceButton
        aria-pressed={props.value === "anchor"}
        fullWidth
        onClick={() => {
          return props.onChange("anchor");
        }}
        variant={props.value === "anchor" ? "contained" : "outlined"}
      >
        Âncora
      </UIChoiceButton>
      <UIChoiceButton
        aria-pressed={props.value === "backlink"}
        fullWidth
        onClick={() => {
          return props.onChange("backlink");
        }}
        variant={props.value === "backlink" ? "contained" : "outlined"}
      >
        Backlink
      </UIChoiceButton>
      <UIChoiceButton
        aria-pressed={props.value === "supports"}
        fullWidth
        onClick={() => {
          return props.onChange("supports");
        }}
        variant={props.value === "supports" ? "contained" : "outlined"}
      >
        Apoia
      </UIChoiceButton>
      <UIChoiceButton
        aria-pressed={props.value === "depends-on"}
        fullWidth
        onClick={() => {
          return props.onChange("depends-on");
        }}
        variant={props.value === "depends-on" ? "contained" : "outlined"}
      >
        Depende de
      </UIChoiceButton>
    </UIGrid>
  );
}

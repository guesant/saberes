import { UIChoiceButton, UIInlineActions } from "@guesant/saberes-ui";
import type { PersonalLensView } from "@guesant/saberes-application";

export interface PersonalKnowledgeViewModeControlsProps {
  onChange(view: PersonalLensView): void;

  view: PersonalLensView;
}

export function PersonalKnowledgeViewModeControls(props: PersonalKnowledgeViewModeControlsProps) {
  return (
    <UIInlineActions wrap>
      <UIChoiceButton
        onClick={() => { props.onChange("tree"); }}
        variant={props.view === "tree" ? "contained" : "outlined"}
      >
        Árvore
      </UIChoiceButton>
      <UIChoiceButton
        onClick={() => { props.onChange("board"); }}
        variant={props.view === "board" ? "contained" : "outlined"}
      >
        Board
      </UIChoiceButton>
    </UIInlineActions>
  );
}

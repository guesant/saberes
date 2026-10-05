import { UIButton, UIInlineActions } from "@guesant/saberes-ui";
import type { PersonalLensView } from "@guesant/saberes-application";

export interface PersonalKnowledgeViewModeControlsProps {
  onChange(view: PersonalLensView): void;

  view: PersonalLensView;
}

export function PersonalKnowledgeViewModeControls(props: PersonalKnowledgeViewModeControlsProps) {
  return (
    <UIInlineActions wrap>
      <UIButton
        onClick={() => { props.onChange("tree"); }}
        variant={props.view === "tree" ? "contained" : "outlined"}
      >
        Árvore
      </UIButton>
      <UIButton
        onClick={() => { props.onChange("board"); }}
        variant={props.view === "board" ? "contained" : "outlined"}
      >
        Board
      </UIButton>
    </UIInlineActions>
  );
}

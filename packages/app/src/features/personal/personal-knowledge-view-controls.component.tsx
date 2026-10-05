import { UIButton, UIContentGroup, UIInlineActions } from "@guesant/saberes-ui";
import { PersonalLensViewButton } from "./personal-lens-view-button.component";
import type { PersonalKnowledgeViewControlsProps } from "./personal-knowledge-view-controls-props.interface";
import type { ReactElement } from "react";

export function PersonalKnowledgeViewControls(props: PersonalKnowledgeViewControlsProps): ReactElement {
  return (
    <UIContentGroup variant="content">
      <UIInlineActions wrap>
        <UIButton
          onClick={() => { props.onViewChange("tree"); }}
          variant={props.view === "tree" ? "contained" : "outlined"}
        >
          Árvore
        </UIButton>
        <UIButton
          onClick={() => { props.onViewChange("board"); }}
          variant={props.view === "board" ? "contained" : "outlined"}
        >
          Board
        </UIButton>
        <UIButton onClick={props.onSaveLens} variant="text">
          Salvar lente
        </UIButton>
      </UIInlineActions>
      {props.lenses.map((lens) => {
        return <PersonalLensViewButton key={lens.id} lens={lens} onSelect={props.onLensSelect} />;
      })}
    </UIContentGroup>
  );
}

import { UIContentGroup, UIInlineActions } from "@guesant/saberes-ui";
import { PersonalKnowledgeViewModeControls } from "./personal-knowledge-view-mode-controls.component";
import { PersonalLensDialog } from "./personal-lens-dialog.component";
import { PersonalLensViewButton } from "./personal-lens-view-button.component";
import type { PersonalKnowledgeViewControlsProps } from "./personal-knowledge-view-controls-props.interface";
import type { ReactElement } from "react";

export function PersonalKnowledgeViewControls(props: PersonalKnowledgeViewControlsProps): ReactElement {
  return (
    <UIContentGroup variant="content">
      <UIInlineActions wrap>
        <PersonalKnowledgeViewModeControls onChange={props.onViewChange} view={props.view} />
        <PersonalLensDialog
          onSave={props.onSaveLens}
          title="Nova lente"
          triggerLabel="Nova lente"
        />
      </UIInlineActions>
      {props.lenses.map((lens) => {
        return (
          <PersonalLensViewButton
            key={lens.id}
            lens={lens}
            onDelete={props.onDeleteLens}
            onSave={props.onSaveLens}
            onSelect={props.onLensSelect}
          />
        );
      })}
    </UIContentGroup>
  );
}

import { UIButton, UIInlineActions } from "@guesant/saberes-ui";
import { PersonalLensDialog } from "./personal-lens-dialog.component";
import type { PersonalLensViewButtonProps } from "./personal-lens-view-button-props.interface";
import type { ReactElement } from "react";

export function PersonalLensViewButton(props: PersonalLensViewButtonProps): ReactElement {
  return (
    <UIInlineActions wrap>
      <UIButton onClick={() => { props.onSelect(props.lens); }} variant="text">
        {props.lens.name}
      </UIButton>
      <PersonalLensDialog
        initialLens={props.lens}
        onDelete={props.onDelete}
        onSave={props.onSave}
        title="Editar lente"
        triggerLabel="Editar"
      />
    </UIInlineActions>
  );
}

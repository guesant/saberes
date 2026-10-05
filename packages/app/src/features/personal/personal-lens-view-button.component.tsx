import { UIButton } from "@guesant/saberes-ui";
import type { PersonalLensViewButtonProps } from "./personal-lens-view-button-props.interface";
import type { ReactElement } from "react";

export function PersonalLensViewButton(props: PersonalLensViewButtonProps): ReactElement {
  return (
    <UIButton onClick={() => { props.onSelect(props.lens); }} variant="text">
      {props.lens.name}
    </UIButton>
  );
}

import { UIBox } from "./box.component";
import { UIContentText } from "./content-text.component";
import type { UIContentFigureProps } from "./content-figure-props.interface";
import type { ReactElement } from "react";

export function UIContentFigure(props: UIContentFigureProps): ReactElement {
  return (
    <UIBox component="figure" gap="md" inset="none" layout="column" sx={{ textAlign: "center" }}>
      <UIBox component="img" alt={props.alt} inset="none" layout="flow" src={props.src} sx={{ maxWidth: "100%" }} />

      <UIContentText variant="caption">{props.caption}</UIContentText>
    </UIBox>
  );
}

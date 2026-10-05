import { Box as MuiBox } from "@mui/material";
import { UIContentText } from "./content-text.component";
import type { UIContentFigureProps } from "./content-figure-props.interface";
import type { ReactElement } from "react";

export function UIContentFigure(props: UIContentFigureProps): ReactElement {
  return (
    <MuiBox component="figure" data-ui-layout="stack" data-ui-outset="lg" sx={{ my: 3, textAlign: "center" }}>
      <MuiBox component="img" data-ui-layout="row" src={props.src} alt={props.alt} sx={{ maxWidth: "100%" }} />

      <UIContentText variant="caption">{props.caption}</UIContentText>
    </MuiBox>
  );
}

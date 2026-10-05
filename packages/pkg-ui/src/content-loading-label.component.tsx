import { Typography as MuiTypography } from "@mui/material";
import type { ReactElement } from "react";

export type UIContentLoadingLabelProps = {
  children: string;
};

export function UIContentLoadingLabel(props: UIContentLoadingLabelProps): ReactElement {
  return (
    <MuiTypography color="text.secondary" data-ui-layout="stack" data-ui-outset="md" sx={{ mt: 2 }}>
      {props.children}
    </MuiTypography>
  );
}

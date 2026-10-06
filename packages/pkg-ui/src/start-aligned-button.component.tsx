import { Button as MuiButton, type ButtonProps as MuiButtonProps } from "@mui/material";
import type { ReactElement } from "react";

export type UIStartAlignedButtonProps = MuiButtonProps;

export function UIStartAlignedButton(props: UIStartAlignedButtonProps): ReactElement {
  return (
    <MuiButton {...props} data-ui-layout="layout-item" sx={{ alignSelf: "flex-start", ...props.sx }}>
      <span data-ui-button-label="true">{props.children}</span>
    </MuiButton>
  );
}

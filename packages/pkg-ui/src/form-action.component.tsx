import { Button as MuiButton, type ButtonProps as MuiButtonProps } from "@mui/material";
import type { ReactElement } from "react";

export type UIFormActionProps = MuiButtonProps;

export function UIFormAction(props: UIFormActionProps): ReactElement {
  return (
    <MuiButton
      {...props}
      data-ui-layout="layout-item"
      sx={{ alignSelf: "flex-start", width: { sm: "auto", xs: "100%" }, ...props.sx }}
    />
  );
}

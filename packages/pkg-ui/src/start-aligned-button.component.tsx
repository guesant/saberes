import { Button as MuiButton, type ButtonProps as MuiButtonProps } from "@mui/material";
import type { ReactElement } from "react";

export type UIStartAlignedButtonProps = MuiButtonProps;

export function UIStartAlignedButton(props: UIStartAlignedButtonProps): ReactElement {
  return <MuiButton {...props} data-ui-layout="row" sx={{ alignSelf: "flex-start", ...props.sx }} />;
}

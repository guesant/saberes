import {
  IconButton as MuiIconButton,
  type IconButtonProps as MuiIconButtonProps,
} from "@mui/material";
import type { ReactElement } from "react";

export type UIIconButtonProps = MuiIconButtonProps;

export function UIIconButton(props: UIIconButtonProps): ReactElement {
  return <MuiIconButton {...props} />;
}

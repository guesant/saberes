import {
  IconButton as MuiIconButton,
  type IconButtonProps as MuiIconButtonProps,
} from "@mui/material";
import type { ReactElement } from "react";

export type IconButtonProps = MuiIconButtonProps;

export function IconButton(props: IconButtonProps): ReactElement {
  return <MuiIconButton {...props} />;
}

import { AppBar as MuiAppBar, type AppBarProps as MuiAppBarProps } from "@mui/material";
import type { ReactElement } from "react";

export type UIAppBarProps = MuiAppBarProps;

export function UIAppBar(props: UIAppBarProps): ReactElement {
  return <MuiAppBar {...props} />;
}

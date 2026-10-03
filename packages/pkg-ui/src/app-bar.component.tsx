import { AppBar as MuiAppBar, type AppBarProps as MuiAppBarProps } from "@mui/material";
import type { ReactElement } from "react";

export type AppBarProps = MuiAppBarProps;

export function AppBar(props: AppBarProps): ReactElement {
  return <MuiAppBar {...props} />;
}

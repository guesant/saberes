import { AppBar as MuiAppBar, type AppBarProps as MuiAppBarProps } from "@mui/material";
import type { ReactElement } from "react";

export type UIAppBarProps = Omit<MuiAppBarProps, "position">;

export function UIAppBar(props: UIAppBarProps): ReactElement {
  return <MuiAppBar {...props} position="sticky" />;
}

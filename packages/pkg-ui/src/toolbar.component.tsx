import { Toolbar as MuiToolbar, type ToolbarProps as MuiToolbarProps } from "@mui/material";
import type { ReactElement } from "react";

export type ToolbarProps = MuiToolbarProps;

export function Toolbar(props: ToolbarProps): ReactElement {
  return <MuiToolbar {...props} />;
}

import { Toolbar as MuiToolbar, type ToolbarProps as MuiToolbarProps } from "@mui/material";
import type { ReactElement } from "react";

export type UIToolbarProps = MuiToolbarProps;

export function UIToolbar(props: UIToolbarProps): ReactElement {
  return <MuiToolbar {...props} />;
}

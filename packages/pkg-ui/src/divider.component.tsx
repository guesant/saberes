import { Divider as MuiDivider, type DividerProps as MuiDividerProps } from "@mui/material";
import type { ReactElement } from "react";

export type UIDividerProps = MuiDividerProps;

export function UIDivider(props: UIDividerProps): ReactElement {
  return <MuiDivider {...props} />;
}

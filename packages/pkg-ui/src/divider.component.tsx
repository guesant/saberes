import { Divider as MuiDivider, type DividerProps as MuiDividerProps } from "@mui/material";
import type { ReactElement } from "react";

export type DividerProps = MuiDividerProps;

export function Divider(props: DividerProps): ReactElement {
  return <MuiDivider {...props} />;
}

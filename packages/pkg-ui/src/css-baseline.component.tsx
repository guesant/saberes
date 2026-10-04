import {
  CssBaseline as MuiCssBaseline,
  type CssBaselineProps as MuiCssBaselineProps,
} from "@mui/material";
import type { ReactElement } from "react";

export type UICssBaselineProps = MuiCssBaselineProps;

export function UICssBaseline(props: UICssBaselineProps): ReactElement {
  return <MuiCssBaseline {...props} />;
}

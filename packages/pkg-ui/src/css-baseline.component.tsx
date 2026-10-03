import {
  CssBaseline as MuiCssBaseline,
  type CssBaselineProps as MuiCssBaselineProps,
} from "@mui/material";
import type { ReactElement } from "react";

export type CssBaselineProps = MuiCssBaselineProps;

export function CssBaseline(props: CssBaselineProps): ReactElement {
  return <MuiCssBaseline {...props} />;
}

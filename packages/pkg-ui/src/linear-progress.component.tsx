import {
  LinearProgress as MuiLinearProgress,
  type LinearProgressProps as MuiLinearProgressProps,
} from "@mui/material";
import type { ReactElement } from "react";

export type UILinearProgressProps = MuiLinearProgressProps;

export function UILinearProgress(props: UILinearProgressProps): ReactElement {
  return <MuiLinearProgress {...props} />;
}

import {
  CircularProgress as MuiCircularProgress,
  type CircularProgressProps as MuiCircularProgressProps,
} from "@mui/material";
import type { ReactElement } from "react";

export type UICircularProgressProps = MuiCircularProgressProps;

export function UICircularProgress(props: UICircularProgressProps): ReactElement {
  return <MuiCircularProgress {...props} />;
}

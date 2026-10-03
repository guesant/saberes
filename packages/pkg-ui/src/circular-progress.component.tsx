import {
  CircularProgress as MuiCircularProgress,
  type CircularProgressProps as MuiCircularProgressProps,
} from "@mui/material";
import type { ReactElement } from "react";

export type CircularProgressProps = MuiCircularProgressProps;

export function CircularProgress(props: CircularProgressProps): ReactElement {
  return <MuiCircularProgress {...props} />;
}

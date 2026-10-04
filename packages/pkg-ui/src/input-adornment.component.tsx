import {
  InputAdornment as MuiInputAdornment,
  type InputAdornmentProps as MuiInputAdornmentProps,
} from "@mui/material";
import type { ReactElement } from "react";

export type UIInputAdornmentProps = MuiInputAdornmentProps;

export function UIInputAdornment(props: UIInputAdornmentProps): ReactElement {
  return <MuiInputAdornment {...props} />;
}

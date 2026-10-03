import {
  InputAdornment as MuiInputAdornment,
  type InputAdornmentProps as MuiInputAdornmentProps,
} from "@mui/material";
import type { ReactElement } from "react";

export type InputAdornmentProps = MuiInputAdornmentProps;

export function InputAdornment(props: InputAdornmentProps): ReactElement {
  return <MuiInputAdornment {...props} />;
}

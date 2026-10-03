import { TextField as MuiTextField, type TextFieldProps as MuiTextFieldProps } from "@mui/material";
import type { ReactElement } from "react";

export type TextFieldProps = MuiTextFieldProps;

export function TextField(props: TextFieldProps): ReactElement {
  return <MuiTextField {...props} />;
}

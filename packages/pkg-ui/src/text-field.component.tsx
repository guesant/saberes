import { TextField as MuiTextField, type TextFieldProps as MuiTextFieldProps } from "@mui/material";
import type { ReactElement } from "react";

export type UITextFieldProps = MuiTextFieldProps;

export function UITextField(props: UITextFieldProps): ReactElement {
  return <MuiTextField {...props} />;
}

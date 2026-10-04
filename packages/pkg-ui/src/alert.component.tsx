import { Alert as MuiAlert, type AlertProps as MuiAlertProps } from "@mui/material";
import type { ReactElement } from "react";

export type UIAlertProps = MuiAlertProps;

export function UIAlert(props: UIAlertProps): ReactElement {
  return <MuiAlert {...props} />;
}

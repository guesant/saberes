import { Alert as MuiAlert, type AlertProps as MuiAlertProps } from "@mui/material";
import type { ReactElement } from "react";

export type AlertProps = MuiAlertProps;

export function Alert(props: AlertProps): ReactElement {
  return <MuiAlert {...props} />;
}

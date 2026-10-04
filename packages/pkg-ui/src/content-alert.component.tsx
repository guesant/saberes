import { Alert as MuiAlert, type AlertProps as MuiAlertProps } from "@mui/material";
import type { ReactElement } from "react";

export type UIContentAlertProps = MuiAlertProps;

export function UIContentAlert(props: UIContentAlertProps): ReactElement {
  return <MuiAlert {...props} sx={{ my: 3, ...props.sx }} />;
}

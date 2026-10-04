import { Alert as MuiAlert } from "@mui/material";
import type { UIContentAlertProps } from "./content-alert-props.interface";
import type { ReactElement } from "react";

export function UIContentAlert(props: UIContentAlertProps): ReactElement {
  return (
    <MuiAlert role={props.role} severity={props.severity} sx={{ my: 3 }}>
      {props.children}
    </MuiAlert>
  );
}

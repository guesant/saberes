import { Alert as MuiAlert, Box as MuiBox } from "@mui/material";
import type { UIContentAlertProps } from "./content-alert-props.interface";
import type { ReactElement } from "react";

export function UIContentAlert(props: UIContentAlertProps): ReactElement {
  return (
    <MuiAlert
      data-ui-alert-severity={props.severity}
      data-ui-layout="layout-item"
      role={props.role}
      severity={props.severity}
    >
      <MuiBox data-ui-gap="sm" data-ui-layout="stack" display="flex" flexDirection="column" gap={1}>
        {props.children}
      </MuiBox>
    </MuiAlert>
  );
}

import { Alert as MuiAlert } from "@mui/material";
import { UIBox } from "./box.component";
import type { UIContentAlertProps } from "./content-alert-props.interface";
import type { ReactElement } from "react";

export function UIContentAlert(props: UIContentAlertProps): ReactElement {
  return (
    <MuiAlert
      role={props.role}
      severity={props.severity}
    >
      <UIBox gap="sm" inset="none" layout="column">
        {props.children}
      </UIBox>
    </MuiAlert>
  );
}

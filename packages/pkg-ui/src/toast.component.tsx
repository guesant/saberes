import { Alert, Snackbar } from "@mui/material";
import type { UIToastProps } from "./toast-props.interface";
import type { ReactElement } from "react";

export function UIToast(props: UIToastProps): ReactElement {
  let role = "status";

  let autoHideDuration: number | null = 3500;

  if (props.severity === "error") {
    role = "alert";
  }

  if (props.autoHideDuration !== undefined) {
    autoHideDuration = props.autoHideDuration;
  }

  return (
    <Snackbar
      anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      autoHideDuration={autoHideDuration}
      onClose={props.onClose}
      open={props.open}
      sx={{
        bottom: { xs: "calc(76px + env(safe-area-inset-bottom))", sm: 24 },
        maxWidth: "min(36rem, calc(100vw - 32px))",
      }}
    >
      <Alert
        onClose={props.onClose}
        role={role}
        severity={props.severity}
        sx={{ width: "100%" }}
      >
        {props.children}
      </Alert>
    </Snackbar>
  );
}

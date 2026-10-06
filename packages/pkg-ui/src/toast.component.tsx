import { Alert, Snackbar } from "@mui/material";
import type { UIToastProps } from "./toast-props.interface";
import type { ReactElement } from "react";

export function UIToast(props: UIToastProps): ReactElement {
  let role = "status";

  if (props.severity === "error") {
    role = "alert";
  }

  return (
    <Snackbar
      anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      autoHideDuration={props.autoHideDuration ?? 3500}
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

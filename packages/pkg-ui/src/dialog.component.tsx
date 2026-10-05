import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import type { UIDialogProps } from "./dialog-props.interface";
import type { ReactElement } from "react";

export function UIDialog(props: UIDialogProps): ReactElement {
  return (
    <Dialog
      data-ui-layout="stack"
      fullWidth
      maxWidth="sm"
      onClose={props.onClose}
      open={props.open}
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent dividers>{props.children}</DialogContent>
    </Dialog>
  );
}

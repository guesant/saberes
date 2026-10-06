import { Dialog, DialogContent } from "@mui/material";
import { UIDialogFooter } from "./dialog-footer.component";
import { UIDialogHeader } from "./dialog-header.component";
import type { UIDialogProps } from "./dialog-props.interface";
import type { ReactElement } from "react";

export function UIDialog(props: UIDialogProps): ReactElement {
  const handleClose = (_event: object, reason: string): void => {
    if (reason !== "backdropClick") {
      props.onClose();
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={handleClose}
      open={props.open}
      PaperProps={{
        sx: { border: "1px solid var(--mui-palette-divider)" },
      }}
    >
      <UIDialogHeader
        closeLabel={props.closeLabel ?? "Fechar"}
        onClose={props.onClose}
        title={props.title}
      />
      <DialogContent
        sx={{
          "&.MuiDialogContent-root": { paddingTop: 3 },
          border: 0,
          padding: 3,
        }}
      >
        {props.children}
      </DialogContent>
      <UIDialogFooter
        actions={props.actions}
        cancelLabel={props.cancelLabel ?? "Cancelar"}
        confirmForm={props.confirmForm}
        confirmLabel={props.confirmLabel ?? "Confirmar"}
        onCancel={props.onClose}
        onConfirm={props.onConfirm ?? props.onClose}
      />
    </Dialog>
  );
}

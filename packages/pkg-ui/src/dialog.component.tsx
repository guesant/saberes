import { Dialog, DialogContent } from "@mui/material";
import { createDialogCloseHandler } from "./create-dialog-close-handler.function";
import { UIDialogFooter } from "./dialog-footer.component";
import { UIDialogHeader } from "./dialog-header.component";
import type { UIDialogProps } from "./dialog-props.interface";
import type { ReactElement } from "react";

const dialogPaperSx = {
  border: "1px solid var(--mui-palette-divider)",
  display: "flex",
  flexDirection: "column",
  maxHeight: { xs: "100dvh", sm: "calc(100% - 64px)" },
  "@media (max-width:599.95px)": {
    borderRadius: 0,
    height: "100vh",
    margin: 0,
    maxHeight: "100vh",
    width: "100vw",
  },
  "@supports (height: 100dvh)": {
    "@media (max-width:599.95px)": {
      height: "100dvh",
      maxHeight: "100dvh",
    },
  },
};

const dialogContentSx = {
  "&.MuiDialogContent-root": { paddingTop: 3 },
  border: 0,
  flex: "1 1 auto",
  minHeight: 0,
  overflowY: "auto",
  padding: 3,
};

export function UIDialog(props: UIDialogProps): ReactElement {
  const handleClose = createDialogCloseHandler(props.onClose);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={handleClose}
      open={props.open}
      PaperProps={{ sx: dialogPaperSx }}
    >
      <UIDialogHeader
        closeLabel={props.closeLabel ?? "Fechar"}
        onClose={props.onClose}
        title={props.title}
      />
      <DialogContent sx={dialogContentSx}>
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

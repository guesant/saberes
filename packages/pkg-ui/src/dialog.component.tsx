import { Close as CloseIcon } from "@mui/icons-material";
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { UIButton } from "./button.component";
import type { UIDialogProps } from "./dialog-props.interface";
import type { ReactElement } from "react";

export function UIDialog(props: UIDialogProps): ReactElement {
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={(_, reason) => {
        if (reason !== "backdropClick") {
          props.onClose();
        }
      }}
      open={props.open}
      PaperProps={{ sx: { border: "1px solid var(--mui-palette-divider)" } }}
    >
      <DialogTitle
        sx={{
          alignItems: "center",
          borderBlockEnd: "1px solid var(--mui-palette-divider)",
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {props.title}
        <IconButton aria-label={props.closeLabel ?? "Fechar"} onClick={props.onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ border: 0, paddingBlock: 3 }}>{props.children}</DialogContent>
      <DialogActions
        sx={{
          borderBlockStart: "1px solid var(--mui-palette-divider)",
          gap: 1,
          padding: 2,
        }}
      >
        <UIButton onClick={props.onClose} variant="outlined">
          {props.cancelLabel ?? "Cancelar"}
        </UIButton>
        {props.actions}
      </DialogActions>
    </Dialog>
  );
}

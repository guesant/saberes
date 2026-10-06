import { Close as CloseIcon } from "@mui/icons-material";
import { DialogTitle, IconButton } from "@mui/material";
import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export interface UIDialogHeaderProps {
  closeLabel: string;
  onClose(): void;
  title: ReactNode;
}

export function UIDialogHeader(props: UIDialogHeaderProps): ReactElement {
  return (
    <UIBox
      align="center"
      component={DialogTitle}
      inset="md"
      layout="row"
      sx={{ borderBlockEnd: "1px solid var(--mui-palette-divider)", justifyContent: "space-between" }}
    >
      {props.title}
      <IconButton aria-label={props.closeLabel} onClick={props.onClose} size="small">
        <CloseIcon />
      </IconButton>
    </UIBox>
  );
}

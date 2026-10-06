import { DialogActions } from "@mui/material";
import { UIBox } from "./box.component";
import { UIButton } from "./button.component";
import type { ReactElement, ReactNode } from "react";

export interface UIDialogFooterProps {
  actions?: ReactNode;
  cancelLabel: string;
  confirmForm?: string;
  confirmLabel: string;
  onCancel(): void;

  onConfirm?(): void;
}

export function UIDialogFooter(props: UIDialogFooterProps): ReactElement {
  const confirmButton = props.actions ?? (
    <UIButton
      form={props.confirmForm}
      iconOnly={false}
      onClick={props.confirmForm ? undefined : props.onConfirm}
      type={props.confirmForm ? "submit" : "button"}
      variant="contained"
    >
      {props.confirmLabel}
    </UIButton>
  );

  return (
    <UIBox
      align="center"
      component={DialogActions}
      gap="sm"
      inset="md"
      layout="row"
      sx={{ borderBlockStart: "1px solid var(--mui-palette-divider)", justifyContent: "flex-end" }}
      wrap
    >
      <UIButton iconOnly={false} onClick={props.onCancel} variant="outlined">
        {props.cancelLabel}
      </UIButton>
      {confirmButton}
    </UIBox>
  );
}

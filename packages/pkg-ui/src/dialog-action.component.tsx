import { useState, type ReactElement, type ReactNode } from "react";
import { UIButton } from "./button.component";
import { UIDialog } from "./dialog.component";

export interface UIDialogActionProps {
  children: ReactNode;
  label: string;
  title: string;
}

export function UIDialogAction(props: UIDialogActionProps): ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <>
      <UIButton iconOnly={false} onClick={() => { return setOpen(true); }} variant="text">
        {props.label}
      </UIButton>
      <UIDialog onClose={() => { return setOpen(false); }} open={open} title={props.title}>
        {props.children}
      </UIDialog>
    </>
  );
}

import { UIButton, UIDialog } from "@guesant/saberes-ui";
import { useState } from "react";
import { StudyCaptureCreate } from "./study-capture-create.component";
import type { StudyCaptureCreateProps } from "./study-capture-create.component";

export interface StudyCaptureCreateDialogProps extends StudyCaptureCreateProps {
  title: string;
  triggerLabel: string;
}

export function StudyCaptureCreateDialog(props: StudyCaptureCreateDialogProps) {
  const [open, setOpen] = useState(false);

  const create: StudyCaptureCreateProps["onCreate"] = async (input) => {
    await props.onCreate(input);

    setOpen(false);
  };

  return (
    <>
      <UIButton onClick={() => { return setOpen(true); }} variant="contained">
        {props.triggerLabel}
      </UIButton>
      <UIDialog onClose={() => { return setOpen(false); }} open={open} title={props.title}>
        <StudyCaptureCreate onCreate={create} />
      </UIDialog>
    </>
  );
}

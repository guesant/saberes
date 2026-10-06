import { UIButton, UIDialog } from "@guesant/saberes-ui";
import { useState } from "react";
import { StudyChecklistCreate } from "./study-checklist-create.component";
import type { StudyChecklistCreateProps } from "./study-checklist-create.component";

export interface StudyChecklistCreateDialogProps extends StudyChecklistCreateProps {
  title: string;
  triggerLabel: string;
}

export function StudyChecklistCreateDialog(props: StudyChecklistCreateDialogProps) {
  const [open, setOpen] = useState(false);

  const create: StudyChecklistCreateProps["onCreate"] = async (...args) => {
    await props.onCreate(...args);

    setOpen(false);
  };

  return (
    <>
      <UIButton
        fullWidth
        iconOnly={false}
        onClick={() => {
          return setOpen(true);
        }}
        variant="contained"
      >
        {props.triggerLabel}
      </UIButton>
      <UIDialog
        onClose={() => {
          return setOpen(false);
        }}
        open={open}
        title={props.title}
      >
        <StudyChecklistCreate onCreate={create} />
      </UIDialog>
    </>
  );
}

import { UIButton, UIDialog } from "@guesant/saberes-ui";
import { useState } from "react";
import { PersonalReferenceCreate } from "./personal-reference-create.component";
import type { PersonalReferenceCreateProps } from "./personal-reference-create.component";

export interface PersonalReferenceCreateDialogProps extends PersonalReferenceCreateProps {
  title: string;
  triggerLabel: string;
}

export function PersonalReferenceCreateDialog(props: PersonalReferenceCreateDialogProps) {
  const [open, setOpen] = useState(false);

  const create: PersonalReferenceCreateProps["onCreate"] = async (...args) => {
    await props.onCreate(...args);

    setOpen(false);
  };

  return (
    <>
      <UIButton onClick={() => { return setOpen(true); }} variant="contained">
        {props.triggerLabel}
      </UIButton>
      <UIDialog onClose={() => { return setOpen(false); }} open={open} title={props.title}>
        <PersonalReferenceCreate onCreate={create} />
      </UIDialog>
    </>
  );
}

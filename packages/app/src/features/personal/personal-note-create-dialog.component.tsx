import { UIButton, UIDialog } from "@guesant/saberes-ui";
import { useState } from "react";
import { PersonalNoteCreate } from "./personal-note-create.component";
import type { PersonalNoteCreateProps } from "./personal-note-create.component";

export interface PersonalNoteCreateDialogProps extends PersonalNoteCreateProps {
  title: string;
  triggerLabel: string;
}

export function PersonalNoteCreateDialog(props: PersonalNoteCreateDialogProps) {
  const [open, setOpen] = useState(false);

  const create: PersonalNoteCreateProps["onCreate"] = async (...args) => {
    await props.onCreate(...args);

    setOpen(false);
  };

  return (
    <>
      <UIButton onClick={() => { return setOpen(true); }} variant="contained">
        {props.triggerLabel}
      </UIButton>
      <UIDialog onClose={() => { return setOpen(false); }} open={open} title={props.title}>
        <PersonalNoteCreate onCreate={create} />
      </UIDialog>
    </>
  );
}

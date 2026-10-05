import { UIButton, UIDialog } from "@guesant/saberes-ui";
import { useState } from "react";
import { CalendarEntryForm } from "./calendar-entry-form.component";
import type { CalendarEntryFormProps } from "./calendar-entry-form-props.interface";

export interface CalendarEntryCreateDialogProps {
  onCreate: CalendarEntryFormProps["onSave"];
  title: string;
  triggerLabel: string;
}

export function CalendarEntryCreateDialog(props: CalendarEntryCreateDialogProps) {
  const [open, setOpen] = useState(false);

  const create: CalendarEntryFormProps["onSave"] = async (input) => {
    await props.onCreate(input);

    setOpen(false);
  };

  return (
    <>
      <UIButton onClick={() => { return setOpen(true); }} variant="contained">
        {props.triggerLabel}
      </UIButton>
      <UIDialog onClose={() => { return setOpen(false); }} open={open} title={props.title}>
        <CalendarEntryForm
          onSave={create}
          submitLabel="Adicionar à agenda"
          title="Novo compromisso local"
        />
      </UIDialog>
    </>
  );
}

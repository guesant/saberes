import { UIButton, UIDialog } from "@guesant/saberes-ui";
import { useState } from "react";
import { CalendarEntryForm } from "./calendar-entry-form.component";
import type { CalendarEntryFormInput } from "./calendar-entry-form-input.interface";
import type { CalendarEntry } from "@guesant/saberes-application";

export interface CalendarEntryEditDialogProps {
  entry: CalendarEntry;
  onSave(entryId: string, input: CalendarEntryFormInput): Promise<void>;
  title: string;
  triggerLabel: string;
}

export function CalendarEntryEditDialog(props: CalendarEntryEditDialogProps) {
  const [open, setOpen] = useState(false);

  const save = async (input: CalendarEntryFormInput): Promise<void> => {
    await props.onSave(props.entry.id, input);

    setOpen(false);
  };

  return (
    <>
      <UIButton onClick={() => { return setOpen(true); }} variant="text">
        {props.triggerLabel}
      </UIButton>
      <UIDialog onClose={() => { return setOpen(false); }} open={open} title={props.title}>
        <CalendarEntryForm
          initialValue={{
            description: props.entry.description,
            endsAt: props.entry.endsAt ?? "",
            startsAt: props.entry.startsAt,
            title: props.entry.title,
          }}
          onSave={save}
          submitLabel={props.triggerLabel}
          title={props.title}
        />
      </UIDialog>
    </>
  );
}

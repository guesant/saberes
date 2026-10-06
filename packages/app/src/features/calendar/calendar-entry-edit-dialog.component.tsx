import { UIButton } from "@guesant/saberes-ui";
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
      <CalendarEntryForm
        dialogTitle={props.title}
        initialValue={{
          description: props.entry.description,
          endsAt: props.entry.endsAt ?? "",
          startsAt: props.entry.startsAt,
          title: props.entry.title,
        }}
        onClose={() => { return setOpen(false); }}
        onSave={save}
        open={open}
        submitLabel={props.triggerLabel}
        title={props.title}
      />
    </>
  );
}

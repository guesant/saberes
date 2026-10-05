import { UIButton, UIDialog } from "@guesant/saberes-ui";
import { useState } from "react";
import { AcademicDisciplineForm } from "./academic-discipline-form.component";
import type { SaveAcademicDisciplineInput } from "./save-academic-discipline-input.interface";

export interface AcademicDisciplineCreateDialogProps {
  onSave(input: SaveAcademicDisciplineInput): Promise<void>;
  title: string;
  triggerLabel: string;
}

export function AcademicDisciplineCreateDialog(props: AcademicDisciplineCreateDialogProps) {
  const [open, setOpen] = useState(false);

  const save = async (input: SaveAcademicDisciplineInput): Promise<void> => {
    await props.onSave(input);

    setOpen(false);
  };

  return (
    <>
      <UIButton onClick={() => { return setOpen(true); }} variant="contained">
        {props.triggerLabel}
      </UIButton>
      <UIDialog onClose={() => { return setOpen(false); }} open={open} title={props.title}>
        <AcademicDisciplineForm onSave={save} />
      </UIDialog>
    </>
  );
}

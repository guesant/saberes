import { UIButton, UIDialog } from "@guesant/saberes-ui";
import { useState } from "react";
import { AcademicDisciplineForm } from "./academic-discipline-form.component";
import type { SaveAcademicDisciplineInput } from "./save-academic-discipline-input.interface";
import type { AcademicDiscipline } from "@guesant/saberes-application";

export interface AcademicDisciplineEditDialogProps {
  discipline: AcademicDiscipline;
  onSave(input: SaveAcademicDisciplineInput): Promise<void>;
  title: string;
  triggerLabel: string;
}

export function AcademicDisciplineEditDialog(props: AcademicDisciplineEditDialogProps) {
  const [open, setOpen] = useState(false);

  const save = async (input: SaveAcademicDisciplineInput): Promise<void> => {
    await props.onSave({ ...input, id: props.discipline.id });

    setOpen(false);
  };

  return (
    <>
      <UIButton onClick={() => { return setOpen(true); }} variant="text">
        {props.triggerLabel}
      </UIButton>
      <UIDialog onClose={() => { return setOpen(false); }} open={open} title={props.title}>
        <AcademicDisciplineForm initialDiscipline={props.discipline} onSave={save} />
      </UIDialog>
    </>
  );
}

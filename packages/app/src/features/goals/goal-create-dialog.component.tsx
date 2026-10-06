import { UIButton, UIDialog } from "@guesant/saberes-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { GoalForm } from "./goal-form.component";
import type { CreateStudyGoalInput } from "./create-study-goal-input.interface";

export interface GoalCreateDialogProps {
  existingTitles: string[];
  onCreate(input: CreateStudyGoalInput): Promise<void>;
  title: string;
  triggerLabel: string;
}

export function GoalCreateDialog(props: GoalCreateDialogProps) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const formId = "study-goal-create-form";

  const create = async (input: CreateStudyGoalInput): Promise<void> => {
    await props.onCreate(input);

    setOpen(false);
  };

  return (
    <>
      <UIButton
        onClick={() => {
          return setOpen(true);
        }}
        variant="contained"
      >
        {props.triggerLabel}
      </UIButton>
      <UIDialog
        confirmForm={formId}
        confirmLabel={t("goals.create")}
        onClose={() => {
          return setOpen(false);
        }}
        open={open}
        title={props.title}
      >
        <GoalForm existingTitles={props.existingTitles} formId={formId} onCreate={create} />
      </UIDialog>
    </>
  );
}

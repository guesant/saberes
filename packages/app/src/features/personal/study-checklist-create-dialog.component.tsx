import { UIButton, UIDialog } from "@guesant/saberes-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StudyChecklistCreate } from "./study-checklist-create.component";
import type { StudyChecklistCreateProps } from "./study-checklist-create.component";

export interface StudyChecklistCreateDialogProps extends Omit<StudyChecklistCreateProps, "formId"> {
  title: string;
  triggerLabel: string;
}

export function StudyChecklistCreateDialog(props: StudyChecklistCreateDialogProps) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const formId = "study-checklist-create-form";

  const create: StudyChecklistCreateProps["onCreate"] = async (...args) => {
    await props.onCreate(...args);

    setOpen(false);
  };

  return (
    <>
      <UIButton
        iconOnly={false}
        onClick={() => {
          return setOpen(true);
        }}
        variant="contained"
      >
        {props.triggerLabel}
      </UIButton>
      <UIDialog
        confirmForm={formId}
        confirmLabel={t("common.save")}
        onClose={() => {
          return setOpen(false);
        }}
        open={open}
        title={props.title}
      >
        <StudyChecklistCreate formId={formId} onCreate={create} />
      </UIDialog>
    </>
  );
}

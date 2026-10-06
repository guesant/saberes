import { UIButton, UIDialog } from "@guesant/saberes-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StudyCaptureCreate } from "./study-capture-create.component";
import type { StudyCaptureCreateProps } from "./study-capture-create.component";

export interface StudyCaptureCreateDialogProps extends Omit<StudyCaptureCreateProps, "formId"> {
  title: string;
  triggerLabel: string;
}

export function StudyCaptureCreateDialog(props: StudyCaptureCreateDialogProps) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const formId = "study-capture-create-form";

  const create: StudyCaptureCreateProps["onCreate"] = async (input) => {
    await props.onCreate(input);

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
        <StudyCaptureCreate formId={formId} onCreate={create} />
      </UIDialog>
    </>
  );
}

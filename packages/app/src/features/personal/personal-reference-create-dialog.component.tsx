import { UIButton, UIDialog } from "@guesant/saberes-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PersonalReferenceCreate } from "./personal-reference-create.component";
import type { PersonalReferenceCreateProps } from "./personal-reference-create.component";

export interface PersonalReferenceCreateDialogProps extends Omit<
  PersonalReferenceCreateProps,
  "formId"
> {
  title: string;
  triggerLabel: string;
}

export function PersonalReferenceCreateDialog(props: PersonalReferenceCreateDialogProps) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const formId = "personal-reference-create-form";

  const create: PersonalReferenceCreateProps["onCreate"] = async (...args) => {
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
        <PersonalReferenceCreate formId={formId} onCreate={create} />
      </UIDialog>
    </>
  );
}

import { UIButton, UIDialog } from "@guesant/saberes-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PersonalNoteCreate } from "./personal-note-create.component";
import type { PersonalNoteCreateProps } from "./personal-note-create.component";

export interface PersonalNoteCreateDialogProps extends Omit<PersonalNoteCreateProps, "formId"> {
  title: string;
  triggerLabel: string;
}

export function PersonalNoteCreateDialog(props: PersonalNoteCreateDialogProps) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const formId = "personal-note-create-form";

  const create: PersonalNoteCreateProps["onCreate"] = async (...args) => {
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
        <PersonalNoteCreate formId={formId} onCreate={create} />
      </UIDialog>
    </>
  );
}

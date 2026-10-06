import { UIButton, UIDialog, UITypography } from "@guesant/saberes-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export interface ActionFeedbackErrorDetailsProps {
  error: Error | null;
}

export function ActionFeedbackErrorDetails(props: ActionFeedbackErrorDetailsProps) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  if (!props.error) {
    return null;
  }

  return (
    <>
      <UIButton iconOnly={false} onClick={() => { return setOpen(true); }} variant="text">{t("errors.showDetails")}</UIButton>
      <UIDialog onClose={() => { return setOpen(false); }} open={open} title={t("errors.showDetails")}>
        <UITypography variant="body2">{props.error.message}</UITypography>
      </UIDialog>
    </>
  );
}

import { UIButton, UIContentGroup, UIDialog, UITypography } from "@guesant/saberes-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ErrorMessage } from "./error-message.component";
import { RetryButton } from "./retry-button.component";

type ContentErrorDetailsProps = {
  message: string;
  onRetry?(): void;
};

export function ContentErrorDetails(props: ContentErrorDetailsProps) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  return (
    <UIContentGroup variant="content">
      <UIButton iconOnly={false} onClick={() => { return setOpen(true); }} variant="text">{t("errors.showDetails")}</UIButton>
      <UIDialog onClose={() => { return setOpen(false); }} open={open} title={t("errors.showDetails")}>
        <ErrorMessage message={props.message} />
      </UIDialog>
      <UITypography color="text.secondary" variant="body2">
        {t("errors.tryAgainHint")}
      </UITypography>

      <RetryButton onRetry={props.onRetry} />
    </UIContentGroup>
  );
}

import { UIContentAlert, UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { ContentErrorDetails } from "./content-error-details.component";

export type ContentErrorStateProps = {
  label?: string;
  error?: unknown;
  onRetry?(): void;
};

export function ContentErrorState(props: ContentErrorStateProps) {
  const { error, label, onRetry } = props;

  const { t } = useTranslation();

  const message = error instanceof Error ? error.message : String(error || "");

  return (
    <UIContentAlert severity="error" role="alert">
      <UIContentGroup variant="content">
        <UITypography fontWeight={700}>{label || t("errors.contentLoad")}</UITypography>

        <UITypography variant="body2">{t("errors.contentLoadDescription")}</UITypography>

        <ContentErrorDetails message={message} onRetry={onRetry} />
      </UIContentGroup>
    </UIContentAlert>
  );
}

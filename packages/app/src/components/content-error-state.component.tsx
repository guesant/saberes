import { Alert, Stack, Typography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { ContentErrorDetails } from "./content-error-details.component";

export type ContentErrorStateProps = {
  label?: string;
  error?: unknown;
  onRetry?: () => void;
};

export function ContentErrorState(props: ContentErrorStateProps) {
  const { error, label, onRetry } = props;

  const { t } = useTranslation();

  const message = error instanceof Error ? error.message : String(error || "");

  return (
    <Alert severity="error" role="alert" sx={{ my: 3 }}>
      <Stack spacing={1}>
        <Typography fontWeight={700}>{label || t("errors.contentLoad")}</Typography>

        <Typography variant="body2">{t("errors.contentLoadDescription")}</Typography>

        <ContentErrorDetails message={message} onRetry={onRetry} />
      </Stack>
    </Alert>
  );
}

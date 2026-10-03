import { CircularProgress, Stack, Typography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export type ContentLoadingStateProps = {
  label?: string;
};

export function ContentLoadingState(props: ContentLoadingStateProps) {
  const { label } = props;

  const { t } = useTranslation();

  return (
    <Stack alignItems="center" role="status" aria-live="polite" sx={{ py: 10 }}>
      <CircularProgress aria-label={t("common.loadingContent")} />

      <Typography sx={{ mt: 2 }} color="text.secondary">
        {label || t("common.loadingContent")}
      </Typography>
    </Stack>
  );
}

import { Button, RefreshIcon } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export type RetryButtonProps = {
  onRetry?: () => void;
};

export function RetryButton(props: RetryButtonProps) {
  const { onRetry } = props;

  const { t } = useTranslation();

  return (
    <Button
      onClick={onRetry}
      disabled={!onRetry}
      startIcon={<RefreshIcon />}
      variant="outlined"
      color="inherit"
      sx={{ alignSelf: "flex-start" }}
    >
      {t("common.retry")}
    </Button>
  );
}

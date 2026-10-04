import { UIRefreshIcon, UIStartAlignedButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export type RetryButtonProps = { onRetry?(): void };

export function RetryButton(props: RetryButtonProps) {
  const { onRetry } = props;

  const { t } = useTranslation();

  return (
    <UIStartAlignedButton
      onClick={onRetry}
      disabled={!onRetry}
      startIcon={<UIRefreshIcon />}
      variant="outlined"
      color="inherit"
    >
      {t("common.retry")}
    </UIStartAlignedButton>
  );
}

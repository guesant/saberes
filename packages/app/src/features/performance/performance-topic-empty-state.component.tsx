import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function PerformanceTopicEmptyState() {
  const { t } = useTranslation();

  return <UITypography color="text.secondary">{t("performance.empty")}</UITypography>;
}

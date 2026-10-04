import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function GoalEmptyState() {
  const { t } = useTranslation();

  return <UITypography color="text.secondary">{t("goals.empty")}</UITypography>;
}

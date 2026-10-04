import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function AssessmentEmptyState() {
  const { t } = useTranslation();

  return <UITypography color="text.secondary">{t("assessment.empty")}</UITypography>;
}

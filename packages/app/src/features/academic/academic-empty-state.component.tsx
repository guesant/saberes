import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function AcademicEmptyState() {
  const { t } = useTranslation();

  return <UITypography color="text.secondary">{t("academic.empty")}</UITypography>;
}

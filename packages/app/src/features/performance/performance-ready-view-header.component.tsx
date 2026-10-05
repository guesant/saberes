import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function PerformanceReadyViewHeader() {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="content">
      <UITypography variant="overline">{t("performance.eyebrow")}</UITypography>
      <UITypography variant="h2">{t("performance.title")}</UITypography>
      <UITypography color="text.secondary">{t("performance.description")}</UITypography>
    </UIContentGroup>
  );
}

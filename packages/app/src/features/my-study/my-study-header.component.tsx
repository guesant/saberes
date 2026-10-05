import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function MyStudyHeader() {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="content">
      <UITypography variant="overline">{t("home.eyebrow")}</UITypography>
      <UITypography variant="h2">{t("home.title")}</UITypography>
      <UITypography color="text.secondary">{t("home.description")}</UITypography>
    </UIContentGroup>
  );
}

import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function PreferencesHeader() {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="content">
      <UITypography variant="overline">{t("preferences.eyebrow")}</UITypography>
      <UITypography variant="h2">{t("preferences.title")}</UITypography>
      <UITypography color="text.secondary">{t("preferences.description")}</UITypography>
    </UIContentGroup>
  );
}

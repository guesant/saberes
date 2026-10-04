import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function CatalogHeader() {
  const { t } = useTranslation();

  return (
    <>
      <UITypography variant="overline" color="secondary.main">
        {t("catalog.eyebrow")}
      </UITypography>

      <UITypography variant="h3">{t("catalog.title")}</UITypography>

      <UITypography color="text.secondary">{t("catalog.description")}</UITypography>
    </>
  );
}

import { Typography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function CatalogHeader() {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="overline" color="secondary.main">
        {t("catalog.eyebrow")}
      </Typography>

      <Typography variant="h3">{t("catalog.title")}</Typography>

      <Typography color="text.secondary">{t("catalog.description")}</Typography>
    </>
  );
}

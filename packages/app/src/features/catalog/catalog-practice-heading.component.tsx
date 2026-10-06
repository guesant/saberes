import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function CatalogPracticeHeading() {
  const { t } = useTranslation();

  return <UITypography variant="h5">{t("discovery.practiceCatalog")}</UITypography>;
}

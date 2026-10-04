import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function CatalogEmptyState() {
  const { t } = useTranslation();

  return <UITypography color="text.secondary">{t("catalog.noResults")}</UITypography>;
}

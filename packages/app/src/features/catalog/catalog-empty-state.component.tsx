import { Typography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function CatalogEmptyState() {
  const { t } = useTranslation();

  return <Typography color="text.secondary">{t("catalog.noResults")}</Typography>;
}

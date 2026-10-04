import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { CatalogSavedFilterEmptyStateProps } from "./catalog-saved-filter-empty-state-props.type";

export function CatalogSavedFilterEmptyState(props: CatalogSavedFilterEmptyStateProps) {
  const { t } = useTranslation();

  if (!props.visible) {
    return null;
  }

  return <UITypography color="text.secondary">{t("catalog.noSavedFilters")}</UITypography>;
}

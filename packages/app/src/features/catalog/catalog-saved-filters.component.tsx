import { UIDisclosure } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { CatalogSavedFiltersContent } from "./catalog-saved-filters-content.component";
import type { CatalogSavedFiltersProps } from "./catalog-saved-filters-props.type";

export function CatalogSavedFilters(props: CatalogSavedFiltersProps) {
  const { t } = useTranslation();

  return (
    <UIDisclosure summary={t("catalog.savedFilters")}>
      <CatalogSavedFiltersContent
        error={props.error}
        filters={props.filters}
        onDelete={props.onDelete}
        onRetry={props.onRetry}
        onSave={props.onSave}
        onSelect={props.onSelect}
        saveError={props.saveError}
        saving={props.saving}
        state={props.state}
      />
    </UIDisclosure>
  );
}

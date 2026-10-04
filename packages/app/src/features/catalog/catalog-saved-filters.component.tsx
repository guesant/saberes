import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { CatalogSavedFilterEmptyState } from "./catalog-saved-filter-empty-state.component";
import { CatalogSavedFilterForm } from "./catalog-saved-filter-form.component";
import { CatalogSavedFilterList } from "./catalog-saved-filter-list.component";
import { CatalogSavedFilterSaveError } from "./catalog-saved-filter-save-error.component";
import { CatalogSavedFiltersFeedback } from "./catalog-saved-filters-feedback.component";
import type { CatalogSavedFiltersProps } from "./catalog-saved-filters-props.type";

export function CatalogSavedFilters(props: CatalogSavedFiltersProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="tight">
      <UITypography variant="h5">{t("catalog.savedFilters")}</UITypography>

      <CatalogSavedFilterForm onSave={props.onSave} saving={props.saving} />

      <CatalogSavedFilterSaveError error={props.saveError} />

      <CatalogSavedFiltersFeedback
        error={props.error}
        onRetry={props.onRetry}
        state={props.state}
      />

      <CatalogSavedFilterList
        filters={props.filters}
        onDelete={props.onDelete}
        onSelect={props.onSelect}
      />

      <CatalogSavedFilterEmptyState visible={!props.filters.length} />
    </UIContentGroup>
  );
}

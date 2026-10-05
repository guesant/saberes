import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { CatalogSavedFilterEmptyState } from "./catalog-saved-filter-empty-state.component";
import { CatalogSavedFilterForm } from "./catalog-saved-filter-form.component";
import { CatalogSavedFilterList } from "./catalog-saved-filter-list.component";
import { CatalogSavedFilterSaveError } from "./catalog-saved-filter-save-error.component";
import { CatalogSavedFiltersFeedback } from "./catalog-saved-filters-feedback.component";
import type { CatalogSavedFiltersContentProps } from "./catalog-saved-filters-content-props.interface";

export function CatalogSavedFiltersContent(props: CatalogSavedFiltersContentProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="content">
      <UITypography variant="h5">{t("catalog.savedFilters")}</UITypography>

      <CatalogSavedFilterForm onSave={props.onSave} saving={props.saving} />

      <CatalogSavedFilterSaveError error={props.saveError} />

      <CatalogSavedFiltersFeedback
        error={props.error}
        onRetry={props.onRetry}
        state={props.state}
      />

      {props.filters.length ? (
        <CatalogSavedFilterList
          filters={props.filters}
          onDelete={props.onDelete}
          onSelect={props.onSelect}
        />
      ) : null}

      <CatalogSavedFilterEmptyState visible={!props.filters.length} />
    </UIContentGroup>
  );
}

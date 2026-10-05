import { UIContentGroup } from "@guesant/saberes-ui";
import { CatalogFilterBar } from "./catalog-filter-bar.component";
import { CatalogSavedFilters } from "./catalog-saved-filters.component";
import { CatalogSearchField } from "./catalog-search-field.component";
import type { CatalogFilterControlsProps } from "./catalog-filter-controls-props.type";

export function CatalogFilterControls(props: CatalogFilterControlsProps) {
  return (
    <UIContentGroup variant="content">
      <CatalogSearchField
        onChange={(search) => {
          return props.viewModel.setFilters((filters) => {
            return { ...filters, search };
          });
        }}
        value={props.viewModel.filters.search || ""}
      />

      <CatalogFilterBar
        filters={props.viewModel.filters}
        onChange={(filters) => {
          return props.viewModel.setFilters(filters);
        }}
      />

      <CatalogSavedFilters
        error={props.viewModel.savedFiltersError}
        filters={props.viewModel.savedFilters}
        onDelete={props.viewModel.deleteFilter}
        onRetry={props.viewModel.reloadSavedFilters}
        onSave={props.viewModel.saveFilter}
        onSelect={props.viewModel.selectFilter}
        saveError={props.viewModel.saveSavedFilterError}
        saving={props.viewModel.savingSavedFilter}
        state={props.viewModel.savedFiltersState}
      />
    </UIContentGroup>
  );
}

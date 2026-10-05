import { useTranslation } from "react-i18next";
import { CatalogFilterDialog } from "./catalog-filter-dialog.component";
import { CatalogSavedFiltersDialog } from "./catalog-saved-filters-dialog.component";
import type { CatalogViewModel } from "./catalog-view-model.type";

export interface CatalogActionsProps {
  viewModel: CatalogViewModel;
}

export function CatalogActions(props: CatalogActionsProps) {
  const { t } = useTranslation();

  return (
    <>
      <CatalogFilterDialog
        title={t("catalog.filterDetails")}
        triggerLabel={t("catalog.filterDetails")}
        viewModel={props.viewModel}
      />

      <CatalogSavedFiltersDialog
        error={props.viewModel.savedFiltersError}
        filters={props.viewModel.savedFilters}
        onDelete={props.viewModel.deleteFilter}
        onRetry={props.viewModel.reloadSavedFilters}
        onSave={props.viewModel.saveFilter}
        onSelect={props.viewModel.selectFilter}
        onUpdate={props.viewModel.updateFilter}
        saveError={props.viewModel.saveSavedFilterError}
        saving={props.viewModel.savingSavedFilter}
        state={props.viewModel.savedFiltersState}
        title={t("catalog.savedFilters")}
        triggerLabel={t("catalog.savedFilters")}
      />
    </>
  );
}

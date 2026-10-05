import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import { createSavedCatalogFilter } from "./create-saved-catalog-filter.function";
import { useCatalogSavedFilterDeleteAction } from "./use-catalog-saved-filter-delete-action.hook";
import { useCatalogSavedFilterUpdateAction } from "./use-catalog-saved-filter-update-action.hook";
import type { CatalogSavedFilterActions } from "./catalog-saved-filter-actions.interface";
import type { CatalogFilters } from "@guesant/saberes-application";

export function useCatalogSavedFilterActions(filters: CatalogFilters): CatalogSavedFilterActions {
  const services = useAppServices();

  const queryClient = useQueryClient();

  const updateAction = useCatalogSavedFilterUpdateAction();

  const deleteAction = useCatalogSavedFilterDeleteAction();

  const saveMutation = useMutation({
    mutationFn: async (name: string): Promise<void> => {
      await services.progress.saveSavedCatalogFilter.execute(
        createSavedCatalogFilter({
          filters,
          id: services.platform.ids.execute(),
          name,
          updatedAt: new Date()
            .toISOString(),
        }),
      );
    },
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: ["catalog", "saved-filters"] });
    },
  });

  return {
    deleteFilter: deleteAction.delete,
    saveError: saveMutation.error ?? updateAction.error ?? deleteAction.error,
    saveFilter: (name: string): Promise<void> => { return saveMutation.mutateAsync(name); },
    saving: saveMutation.isPending || updateAction.pending || deleteAction.pending,
    updateFilter: updateAction.update,
  };
}

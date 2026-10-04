import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import { createSavedCatalogFilter } from "./create-saved-catalog-filter.function";
import type { CatalogSavedFilterActions } from "./catalog-saved-filter-actions.interface";
import type { CatalogFilters } from "@guesant/saberes-application";

export function useCatalogSavedFilterActions(filters: CatalogFilters): CatalogSavedFilterActions {
  const services = useAppServices();

  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (name: string): Promise<void> => {
      await services.progress.saveSavedCatalogFilter.execute(
        createSavedCatalogFilter({
          filters,
          id: services.platform.ids.execute(),
          name,
          updatedAt: new Date().toISOString(),
        }),
      );
    },
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: ["catalog", "saved-filters"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string): Promise<void> =>
      services.progress.deleteSavedCatalogFilter.execute(id),
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: ["catalog", "saved-filters"] });
    },
  });

  return {
    deleteFilter: (id: string): Promise<void> => deleteMutation.mutateAsync(id),
    saveError: saveMutation.error ?? null,
    saveFilter: (name: string): Promise<void> => saveMutation.mutateAsync(name),
    saving: saveMutation.isPending,
  };
}

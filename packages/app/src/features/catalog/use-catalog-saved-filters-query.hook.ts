import { useQuery } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getQueryViewState } from "../../view-models/get-query-view-state.function";
import type { CatalogSavedFiltersQueryViewModel } from "./catalog-saved-filters-query-view-model.interface";

export function useCatalogSavedFiltersQuery(): CatalogSavedFiltersQueryViewModel {
  const services = useAppServices();

  const query = useQuery({
    queryKey: ["catalog", "saved-filters"],
    queryFn: () => {
      return services.progress.listSavedCatalogFilters.execute();
    },
  });

  return {
    data: query.data ?? [],
    error: query.error ?? null,
    reload: async (): Promise<void> => {
      await query.refetch();
    },
    state: getQueryViewState(query),
  };
}

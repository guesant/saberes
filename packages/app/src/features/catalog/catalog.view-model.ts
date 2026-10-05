import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getQueryViewState } from "../../view-models/get-query-view-state.function";
import { useCatalogSavedFilterActions } from "./use-catalog-saved-filter-actions.hook";
import { useCatalogSavedFiltersQuery } from "./use-catalog-saved-filters-query.hook";
import type {
  CatalogFilters,
  CatalogReadModel,
  SavedCatalogFilter,
} from "@guesant/saberes-application";
import type { Dispatch, SetStateAction } from "react";

export type CatalogViewModelState = "loading" | "error" | "ready";

export interface CatalogViewModel {
  state: CatalogViewModelState;
  data: CatalogReadModel | null;
  error: Error | null;
  filters: CatalogFilters;
  setFilters: Dispatch<SetStateAction<CatalogFilters>>;
  savedFilters: SavedCatalogFilter[];
  savedFiltersState: CatalogViewModelState;
  savedFiltersError: Error | null;
  savingSavedFilter: boolean;
  saveSavedFilterError: Error | null;
  saveFilter(name: string): Promise<void>;

  selectFilter(filter: SavedCatalogFilter): void;

  deleteFilter(id: string): Promise<void>;

  updateFilter(filter: SavedCatalogFilter, name: string): Promise<void>;

  reloadSavedFilters(): Promise<void>;

  reload(): Promise<void>;
}

export function useCatalogViewModel(): CatalogViewModel {
  const services = useAppServices();

  const [filters, setFilters] = useState<CatalogFilters>({ search: "" });

  const query = useQuery({
    queryKey: ["catalog", filters],
    placeholderData: (previousData) => { return previousData; },
    queryFn: () => { return services.catalog.get.execute(filters); },
  });

  const savedFiltersQuery = useCatalogSavedFiltersQuery();

  const savedFilterActions = useCatalogSavedFilterActions(filters);

  const state: CatalogViewModelState = getQueryViewState(query);

  return useMemo(() => {
    return {
      state,
      data: query.data ?? null,
      error: query.error ?? null,
      filters,
      setFilters,
      savedFilters: savedFiltersQuery.data,
      savedFiltersState: savedFiltersQuery.state,
      savedFiltersError: savedFiltersQuery.error,
      savingSavedFilter: savedFilterActions.saving,
      saveSavedFilterError: savedFilterActions.saveError,
      saveFilter: savedFilterActions.saveFilter,
      selectFilter: (filter: SavedCatalogFilter): void => { return setFilters(filter.filters); },
      deleteFilter: savedFilterActions.deleteFilter,
      updateFilter: savedFilterActions.updateFilter,
      reloadSavedFilters: savedFiltersQuery.reload,
      reload: async (): Promise<void> => {
        await Promise.all([query.refetch(), savedFiltersQuery.reload()]);
      },
    };
  }, [filters, query, savedFilterActions, savedFiltersQuery, setFilters, state]);
}

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getQueryViewState } from "../../view-models/get-query-view-state.function";
import type { CatalogFilters, CatalogReadModel } from "@guesant/saberes-application";
import type { Dispatch, SetStateAction } from "react";

export type CatalogViewModelState = "loading" | "error" | "ready";

export interface CatalogViewModel {
  state: CatalogViewModelState;
  data: CatalogReadModel | null;
  error: Error | null;
  filters: CatalogFilters;
  setFilters: Dispatch<SetStateAction<CatalogFilters>>;
  reload: () => Promise<void>;
}

export function useCatalogViewModel(): CatalogViewModel {
  const services = useAppServices();

  const [filters, setFilters] = useState<CatalogFilters>({ search: "" });

  const query = useQuery({
    queryKey: ["catalog", filters],
    queryFn: () => services.catalog.get.execute(filters),
  });

  const state: CatalogViewModelState = getQueryViewState(query);

  return useMemo(
    () => ({
      state,
      data: query.data ?? null,
      error: query.error ?? null,
      filters,
      setFilters,
      reload: async (): Promise<void> => {
        await query.refetch();
      },
    }),
    [filters, query.data, query.error, query.refetch, state],
  );
}

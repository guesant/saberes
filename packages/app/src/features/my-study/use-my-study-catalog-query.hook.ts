import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { ApplicationServices, CatalogReadModel } from "@guesant/saberes-application";

export function useMyStudyCatalogQuery(
  services: ApplicationServices,
): UseQueryResult<CatalogReadModel, Error> {
  return useQuery({
    queryKey: ["catalog", { search: "" }],
    queryFn: () => services.catalog.get.execute({ search: "" }),
  });
}

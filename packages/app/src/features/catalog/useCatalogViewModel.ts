import type { CatalogFilters } from "@guesant/saberes-core";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useAppServices } from "../../composition/AppServicesContext";

export function useCatalogViewModel() {
    const services = useAppServices();
    const [filters, setFilters] = useState<CatalogFilters>({ search: "" });
    const query = useQuery({
        queryKey: ["catalog", filters],
        queryFn: () => services.getCatalog(filters),
    });
    let state: "loading" | "error" | "ready" = "ready";
    if (query.isPending) state = "loading";
    else if (query.isError) state = "error";

    return useMemo(
        () => ({
            state,
            data: query.data || null,
            error: query.error as Error | null,
            filters,
            setFilters,
            reload: query.refetch,
        }),
        [filters, query.data, query.error, query.refetch, state],
    );
}

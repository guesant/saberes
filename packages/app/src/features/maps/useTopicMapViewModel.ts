import { useQuery } from "@tanstack/react-query";
import { useAppServices } from "../../composition/AppServicesContext";

export function useTopicMapViewModel(mapKey: string) {
    const services = useAppServices();
    const query = useQuery({
        queryKey: ["topic-map", mapKey],
        queryFn: () => services.maps.get(mapKey),
    });
    let state: "loading" | "error" | "ready" = "ready";
    if (query.isPending) state = "loading";
    else if (query.isError) state = "error";
    return {
        state,
        data: query.data || null,
        error: query.error as Error | null,
        reload: query.refetch,
    } as const;
}

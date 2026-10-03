import { useQuery } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getQueryViewState } from "../../view-models/get-query-view-state.function";
import type { TopicMapReadModel } from "@guesant/saberes-application";

export type TopicMapViewModelState = "loading" | "error" | "ready";

export interface TopicMapViewModel {
  state: TopicMapViewModelState;
  data: TopicMapReadModel | null;
  error: Error | null;
  reload: () => Promise<void>;
}

export function useTopicMapViewModel(mapKey: string): TopicMapViewModel {
  const services = useAppServices();

  const query = useQuery({
    queryKey: ["topic-map", mapKey],
    queryFn: () => services.maps.get.execute(mapKey),
  });

  const state: TopicMapViewModelState = getQueryViewState(query);

  return {
    state,
    data: query.data ?? null,
    error: query.error ?? null,
    reload: async (): Promise<void> => {
      await query.refetch();
    },
  };
}

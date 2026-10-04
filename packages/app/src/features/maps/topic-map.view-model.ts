import { useQuery } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getQueryViewState } from "../../view-models/get-query-view-state.function";
import { getTopicMapWithMastery } from "./get-topic-map-with-mastery.function";
import { reloadTopicMapData } from "./reload-topic-map-data.function";
import type { TopicMapReadModel } from "@guesant/saberes-application";

export type TopicMapViewModelState = "loading" | "error" | "ready";

export interface TopicMapViewModel {
  state: TopicMapViewModelState;
  data: TopicMapReadModel | null;
  error: Error | null;
  progressError: Error | null;
  reload(): Promise<void>;
}

export function useTopicMapViewModel(mapKey: string): TopicMapViewModel {
  const services = useAppServices();

  const query = useQuery({
    queryKey: ["topic-map", mapKey],
    queryFn: () => {
      return services.maps.get.execute(mapKey);
    },
  });

  const masteryQuery = useQuery({
    queryKey: ["progress", "topic-mastery"],
    queryFn: () => {
      return services.progress.listTopicMastery.execute();
    },
  });

  const state: TopicMapViewModelState = getQueryViewState(query);

  return {
    state,
    data: getTopicMapWithMastery({ data: query.data, mastery: masteryQuery.data }),
    error: query.error ?? null,
    progressError: masteryQuery.error ?? null,
    reload: async (): Promise<void> => {
      await reloadTopicMapData({
        reloadMap: query.refetch,
        reloadMastery: masteryQuery.refetch,
      });
    },
  };
}

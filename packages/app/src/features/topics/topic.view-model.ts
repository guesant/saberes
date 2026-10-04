import { useQuery } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getQueryViewState } from "../../view-models/get-query-view-state.function";
import type { TopicReadModel } from "@guesant/saberes-application";

export type TopicViewModelState = "loading" | "error" | "ready";

export interface TopicViewModel {
  state: TopicViewModelState;
  data: TopicReadModel | null;
  error: Error | null;
  reload(): Promise<void>;
}

export function useTopicViewModel(slug: string): TopicViewModel {
  const services = useAppServices();

  const query = useQuery({
    queryKey: ["topic", slug],
    enabled: Boolean(slug),
    queryFn: () => {
      return services.topics.get.execute(slug);
    },
  });

  return {
    state: getQueryViewState(query),
    data: query.data ?? null,
    error: query.error ?? null,
    reload: async (): Promise<void> => {
      await query.refetch();
    },
  };
}

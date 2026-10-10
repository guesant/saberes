import { useQuery } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getQueryViewState } from "../../view-models/get-query-view-state.function";
import type { TrainingScope } from "@guesant/saberes-domain";
import type { TopicReadModel } from "@guesant/saberes-application";

const unicamp2027FirstPhaseScope: TrainingScope = {
  targetEditionSlug: "unicamp-2027",
  targetStageSlug: "primeira-fase",
};

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
      return services.topics.get.execute(slug, unicamp2027FirstPhaseScope);
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

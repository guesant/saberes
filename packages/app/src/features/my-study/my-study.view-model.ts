import { useQuery } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getQueryViewState } from "../../view-models/get-query-view-state.function";
import { getMyStudyData } from "./get-my-study-data.function";
import { getMyStudyProgressError } from "./get-my-study-progress-error.function";
import { getMyStudyViewState } from "./get-my-study-view-state.function";
import { useMyStudyProgressQueries } from "./use-my-study-progress-queries.hook";
import type { MyStudyReadModel } from "./my-study-read-model.interface";

export type MyStudyViewModelState = "loading" | "error" | "ready";

export interface MyStudyViewModel {
  state: MyStudyViewModelState;
  data: MyStudyReadModel;
  error: Error | null;
  progressError: Error | null;
  reload: () => Promise<void>;
}

export function useMyStudyViewModel(): MyStudyViewModel {
  const services = useAppServices();

  const catalogQuery = useQuery({
    queryKey: ["catalog", { search: "" }],
    queryFn: () => services.catalog.get.execute({ search: "" }),
  });

  const progressQueries = useMyStudyProgressQueries(services);

  const catalogState = getQueryViewState(catalogQuery);

  const state: MyStudyViewModelState = getMyStudyViewState(catalogState);

  return {
    state,
    data: getMyStudyData({
      attempts: progressQueries.attempts,
      catalog: catalogQuery.data,
      reviews: progressQueries.reviews,
      streak: progressQueries.streak,
      achievements: progressQueries.achievements,
      topicMastery: progressQueries.topicMastery,
      bookmarks: progressQueries.bookmarks,
      date: new Date(),
    }),
    error: catalogQuery.error || null,
    progressError: getMyStudyProgressError({
      attemptsError: progressQueries.attemptsError,
      reviewsError: progressQueries.reviewsError,
      streakError: progressQueries.streakError,
      achievementsError: progressQueries.achievementsError,
      topicMasteryError: progressQueries.topicMasteryError,
      bookmarksError: progressQueries.bookmarksError,
    }),
    reload: async (): Promise<void> => {
      await Promise.all([catalogQuery.refetch(), progressQueries.reload()]);
    },
  };
}

import { useAppServices } from "../../composition/use-app-services.hook";
import { createMyStudyDataInput } from "./create-my-study-data-input.function";
import { createMyStudyProgressErrorInput } from "./create-my-study-progress-error-input.function";
import { getMyStudyData } from "./get-my-study-data.function";
import { getMyStudyProgressError } from "./get-my-study-progress-error.function";
import { getMyStudyViewState } from "./get-my-study-view-state.function";
import { useMyStudyCatalogQuery } from "./use-my-study-catalog-query.hook";
import { useMyStudyContentReleaseQuery } from "./use-my-study-content-release-query.hook";
import { useMyStudyProgressQueries } from "./use-my-study-progress-queries.hook";
import type { MyStudyReadModel } from "./my-study-read-model.interface";
import type { ContentReleaseReadModel } from "@guesant/saberes-application";

export type MyStudyViewModelState = "loading" | "error" | "ready";

export interface MyStudyViewModel {
  state: MyStudyViewModelState;
  data: MyStudyReadModel;
  error: Error | null;
  catalogError: Error | null;
  progressError: Error | null;
  contentRelease: ContentReleaseReadModel | null;
  contentReleaseError: Error | null;
  reload(): Promise<void>;
}

export function useMyStudyViewModel(): MyStudyViewModel {
  const services = useAppServices();

  const catalogQuery = useMyStudyCatalogQuery(services);

  const contentReleaseQuery = useMyStudyContentReleaseQuery(services);

  const progressQueries = useMyStudyProgressQueries(services);

  const state: MyStudyViewModelState = getMyStudyViewState(catalogQuery.isPending);

  return {
    state,
    data: getMyStudyData(
      createMyStudyDataInput({
        catalog: catalogQuery.data,
        date: new Date(),
        progress: progressQueries,
      }),
    ),
    error: catalogQuery.error || null,
    catalogError: catalogQuery.error || null,
    progressError: getMyStudyProgressError(createMyStudyProgressErrorInput(progressQueries)),
    contentRelease: contentReleaseQuery.data || null,
    contentReleaseError: contentReleaseQuery.error || null,
    reload: async (): Promise<void> => {
      await Promise.all([
        catalogQuery.refetch(),
        contentReleaseQuery.refetch(),
        progressQueries.reload(),
      ]);
    },
  };
}

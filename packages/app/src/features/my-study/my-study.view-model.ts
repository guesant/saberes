import { useQuery } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getQueryViewState } from "../../view-models/get-query-view-state.function";
import { createMyStudyDataInput } from "./create-my-study-data-input.function";
import { createMyStudyProgressErrorInput } from "./create-my-study-progress-error-input.function";
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
    data: getMyStudyData(
      createMyStudyDataInput({
        catalog: catalogQuery.data,
        date: new Date(),
        progress: progressQueries,
      }),
    ),
    error: catalogQuery.error || null,
    progressError: getMyStudyProgressError(createMyStudyProgressErrorInput(progressQueries)),
    reload: async (): Promise<void> => {
      await Promise.all([catalogQuery.refetch(), progressQueries.reload()]);
    },
  };
}

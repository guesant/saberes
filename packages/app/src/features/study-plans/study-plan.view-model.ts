import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import { createStudyPlanStepUpdater } from "./create-study-plan-step-updater.function";
import { getStudyPlanError } from "./get-study-plan-error.function";
import { getStudyPlanViewState } from "./get-study-plan-view-state.function";
import { reloadStudyPlanData } from "./reload-study-plan.function";
import type { StudyPlanReadModel, StudyRecord } from "@guesant/saberes-application";

export type StudyPlanViewModelState = "loading" | "error" | "ready";

export interface StudyPlanViewModel {
  state: StudyPlanViewModelState;
  data: StudyPlanReadModel | null;
  progress: StudyRecord[];
  error: Error | null;
  reload: () => Promise<void>;
  toggleStep: (step: Record<string, unknown>, completed: boolean) => Promise<void>;
}

export function useStudyPlanViewModel(slug?: string): StudyPlanViewModel {
  const services = useAppServices();

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["study-plan", slug ?? "default"],
    queryFn: () => services.studyPlans.get.execute(slug),
  });

  const progressQuery = useQuery({
    queryKey: ["plan-progress"],
    queryFn: () => services.progress.listPlanProgress.execute(),
  });

  const updateStepProgress = createStudyPlanStepUpdater({
    services,
    queryClient,
    data: query.data,
  });

  const state = getStudyPlanViewState(query, progressQuery);

  const reload = async (): Promise<void> => {
    await reloadStudyPlanData({
      reloadPlan: query.refetch,
      reloadProgress: progressQuery.refetch,
    });
  };

  return {
    state,
    data: query.data ?? null,
    progress: progressQuery.data ?? [],
    error: getStudyPlanError(query.error, progressQuery.error),
    reload,
    toggleStep: updateStepProgress,
  };
}

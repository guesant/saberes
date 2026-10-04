import { useQueryClient } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import { createStudyPlanActions } from "./create-study-plan-actions.function";
import { createStudyPlanViewModelResult } from "./create-study-plan-view-model-result.function";
import { getStudyPlanContentSteps } from "./get-study-plan-content-steps.function";
import { getStudyPlanDerivedState } from "./get-study-plan-derived-state.function";
import { getStudyPlanError } from "./get-study-plan-error.function";
import { getStudyPlanProgressRecords } from "./get-study-plan-progress-records.function";
import { getStudyPlanReadData } from "./get-study-plan-read-data.function";
import { getStudyPlanViewState } from "./get-study-plan-view-state.function";
import { useStudyPlanQueries } from "./use-study-plan-queries.hook";
import type { StudyPlanLocalState } from "./study-plan-local-state.interface";
import type { StudyPlanReadModel, StudyRecord } from "@guesant/saberes-application";

export type StudyPlanViewModelState = "loading" | "error" | "ready";

export interface StudyPlanViewModel {
  state: StudyPlanViewModelState;
  data: StudyPlanReadModel | null;
  progress: StudyRecord[];
  localState: StudyPlanLocalState;
  steps: Array<Record<string, unknown>>;
  nextStep: Record<string, unknown> | null;
  error: Error | null;
  reload: () => Promise<void>;
  toggleStep: (step: Record<string, unknown>, completed: boolean) => Promise<void>;
  togglePause: () => Promise<void>;
  updateStartDate: (startDate: string) => Promise<void>;
  updateTargetDate: (targetDate: string) => Promise<void>;
  updateDailyMinutes: (dailyMinutes: number) => Promise<void>;
  skipStep: (stepId: string) => Promise<void>;
  moveStep: (stepId: string, direction: -1 | 1) => Promise<void>;
}

export function useStudyPlanViewModel(slug?: string): StudyPlanViewModel {
  const services = useAppServices();

  const { planQuery: query, progressQuery } = useStudyPlanQueries(services, slug);

  const derivedState = getStudyPlanDerivedState({
    steps: getStudyPlanContentSteps(query.data),
    progress: getStudyPlanProgressRecords(progressQuery.data),
    slug,
  });

  const actions = createStudyPlanActions({
    services,
    queryClient: useQueryClient(),
    data: query.data,
    slug,
    state: derivedState.localState,
    steps: derivedState.orderedSteps,
    reloadPlan: query.refetch,
    reloadProgress: progressQuery.refetch,
  });

  return createStudyPlanViewModelResult({
    state: getStudyPlanViewState(query, progressQuery),
    data: getStudyPlanReadData(query.data),
    progress: getStudyPlanProgressRecords(progressQuery.data),
    localState: derivedState.localState,
    steps: derivedState.orderedSteps,
    nextStep: derivedState.nextStep,
    error: getStudyPlanError(query.error, progressQuery.error),
    actions,
  });
}

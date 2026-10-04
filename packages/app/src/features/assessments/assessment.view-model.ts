import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getQueryViewState } from "../../view-models/get-query-view-state.function";
import { getAssessmentProgress } from "./get-assessment-progress.function";
import type { AssessmentProgress } from "./assessment-progress.interface";
import type { AssessmentReadModel } from "@guesant/saberes-application";

export type AssessmentViewModelState = "loading" | "error" | "ready";

export interface AssessmentViewModel {
  state: AssessmentViewModelState;
  data: AssessmentReadModel | null;
  error: Error | null;
  progress: AssessmentProgress | null;
  progressError: Error | null;
  reload: () => Promise<void>;
}

export function useAssessmentViewModel(key?: string): AssessmentViewModel {
  const services = useAppServices();

  const query = useQuery({
    queryKey: ["assessment", key || ""],
    enabled: Boolean(key),
    queryFn: () => services.assessments.get.execute(key || ""),
  });

  const attemptsQuery = useQuery({
    queryKey: ["progress", "attempts"],
    queryFn: () => services.progress.listAttempts.execute(),
  });

  const progress = useMemo(() => {
    if (!query.data || !attemptsQuery.data) {
      return null;
    }

    return getAssessmentProgress({ attempts: attemptsQuery.data, items: query.data.items });
  }, [attemptsQuery.data, query.data]);

  return {
    state: getQueryViewState(query),
    data: query.data || null,
    error: query.error || null,
    progress,
    progressError: attemptsQuery.error || null,
    reload: async (): Promise<void> => {
      await Promise.all([query.refetch(), attemptsQuery.refetch()]);
    },
  };
}

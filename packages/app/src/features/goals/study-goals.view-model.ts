import { StudyGoalStatus, type StudyGoal } from "@guesant/saberes-application";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getQueryViewState } from "../../view-models/get-query-view-state.function";
import { createStudyGoalsActions } from "./create-study-goals-actions.function";
import { useSaveStudyGoalMutation } from "./use-save-study-goal-mutation.hook";
import { useStudyGoalsQuery } from "./use-study-goals-query.hook";
import type { CreateStudyGoalInput } from "./create-study-goal-input.interface";

export interface UseStudyGoalsViewModel {
  state: "loading" | "error" | "ready";
  goals: StudyGoal[];
  error: Error | null;
  create(input: CreateStudyGoalInput): Promise<void>;

  pause(contentKey: string): Promise<void>;

  resume(contentKey: string): Promise<void>;

  complete(contentKey: string): Promise<void>;

  archive(contentKey: string): Promise<void>;

  restore(contentKey: string): Promise<void>;

  updateProgress(contentKey: string, current: number): Promise<void>;

  saveError: Error | null;
  reload(): Promise<void>;
}

export function useStudyGoalsViewModel(): UseStudyGoalsViewModel {
  const services = useAppServices();

  const query = useStudyGoalsQuery(services);

  const mutation = useSaveStudyGoalMutation(services);

  const goals = query.data ?? [];

  const state = getQueryViewState(query);

  const actions = createStudyGoalsActions({
    goals,
    id: () => services.platform.ids.execute(),
    save: async (goal): Promise<void> => {
      await mutation.mutateAsync(goal);
    },
    status: StudyGoalStatus,
  });

  return {
    state,
    goals,
    error: query.error ?? null,
    ...actions,
    saveError: mutation.error,
    reload: async (): Promise<void> => {
      await query.refetch();
    },
  };
}

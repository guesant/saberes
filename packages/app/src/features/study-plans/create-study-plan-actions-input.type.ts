import type { StudyPlanLocalState } from "./study-plan-local-state.interface";
import type { ApplicationServices, StudyPlanReadModel } from "@guesant/saberes-application";
import type { QueryClient } from "@tanstack/react-query";

export type CreateStudyPlanActionsInput = {
  services: ApplicationServices;
  queryClient: QueryClient;
  data: StudyPlanReadModel | undefined;
  slug: string | undefined;
  state: StudyPlanLocalState;
  reloadPlan: () => Promise<unknown>;
  reloadProgress: () => Promise<unknown>;
};

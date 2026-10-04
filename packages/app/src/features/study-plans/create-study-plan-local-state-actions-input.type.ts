import type { StudyPlanLocalState } from "./study-plan-local-state.interface";
import type { ApplicationServices } from "@guesant/saberes-application";
import type { QueryClient } from "@tanstack/react-query";

export type CreateStudyPlanLocalStateActionsInput = {
  services: ApplicationServices;
  queryClient: QueryClient;
  slug: string | undefined;
  state: StudyPlanLocalState;
};

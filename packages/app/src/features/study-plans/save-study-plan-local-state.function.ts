import { getStudyPlanStateContentKey } from "./get-study-plan-state-content-key.function";
import type { StudyPlanLocalState } from "./study-plan-local-state.interface";
import type { ApplicationServices } from "@guesant/saberes-application";
import type { QueryClient } from "@tanstack/react-query";

export interface SaveStudyPlanLocalStateInput {
  services: ApplicationServices;
  queryClient: QueryClient;
  slug: string | undefined;
  state: StudyPlanLocalState;
}

export async function saveStudyPlanLocalState(input: SaveStudyPlanLocalStateInput): Promise<void> {
  await input.services.studyPlans.saveProgress.execute({
    contentKey: getStudyPlanStateContentKey(input.slug),
    data: {
      status: input.state.status,
      startDate: input.state.startDate,
      targetDate: input.state.targetDate,
      dailyMinutes: input.state.dailyMinutes,
      orderedStepIds: input.state.orderedStepIds,
      skippedStepIds: input.state.skippedStepIds,
    },
  });

  await input.queryClient.invalidateQueries({ queryKey: ["plan-progress"] });
}

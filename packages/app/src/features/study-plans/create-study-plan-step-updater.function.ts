import { updateStudyPlanStep } from "./update-study-plan-step.function";
import type { ApplicationServices, StudyPlanReadModel } from "@guesant/saberes-application";
import type { QueryClient } from "@tanstack/react-query";

type CreateStudyPlanStepUpdaterInput = {
  services: ApplicationServices;
  queryClient: QueryClient;
  data: StudyPlanReadModel | undefined;
};

export function createStudyPlanStepUpdater(
  input: CreateStudyPlanStepUpdaterInput,
): (step: Record<string, unknown>, completed: boolean) => Promise<void> {
  return (step: Record<string, unknown>, completed: boolean): Promise<void> =>
    updateStudyPlanStep({
      ...input,
      step,
      completed,
    });
}

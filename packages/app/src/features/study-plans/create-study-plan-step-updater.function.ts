import { updateStudyPlanStep } from "./update-study-plan-step.function";
import type { AsyncAction } from "../../types/async-action.type";
import type { ApplicationServices, StudyPlanReadModel } from "@guesant/saberes-application";
import type { QueryClient } from "@tanstack/react-query";

type CreateStudyPlanStepUpdaterInput = {
  services: ApplicationServices;
  queryClient: QueryClient;
  data: StudyPlanReadModel | undefined;
};

export function createStudyPlanStepUpdater(
  input: CreateStudyPlanStepUpdaterInput,
): AsyncAction<[Record<string, unknown>, boolean], void> {
  return (step: Record<string, unknown>, completed: boolean): Promise<void> => {
    return updateStudyPlanStep({
      ...input,
      step,
      completed,
    });
  };
}

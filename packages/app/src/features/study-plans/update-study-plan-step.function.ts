import type { ApplicationServices, StudyPlanReadModel } from "@guesant/saberes-application";
import type { QueryClient } from "@tanstack/react-query";

export type UpdateStudyPlanStepInput = {
  services: ApplicationServices;
  queryClient: QueryClient;
  data: StudyPlanReadModel | undefined;
  step: Record<string, unknown>;
  completed: boolean;
};

export async function updateStudyPlanStep(input: UpdateStudyPlanStepInput): Promise<void> {
  const plan = input.data?.plan;

  if (!plan) {
    return;
  }

  const planId = plan.id;

  if (!planId) {
    return;
  }

  await input.services.studyPlans.saveProgress.execute({
    contentKey: `plan:${String(plan.slug || planId)}:step:${String(input.step.id)}`,
    data: {
      planId,
      stepId: input.step.id,
      completed: input.completed,
    },
  });

  await input.queryClient.invalidateQueries({ queryKey: ["plan-progress"] });
}

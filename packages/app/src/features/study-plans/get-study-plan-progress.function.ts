import type { StudyPlanProgress } from "./study-plan-progress.interface";

export interface GetStudyPlanProgressInput {
  steps: Array<Record<string, unknown>>;
  completed: Set<string>;
}

export function getStudyPlanProgress(input: GetStudyPlanProgressInput): StudyPlanProgress {
  const totalSteps = input.steps.length;

  const completedSteps = input.steps.filter((step) => {
    return input.completed.has(String(step.id));
  }).length;

  return {
    completedSteps,
    percentage: totalSteps ? Math.round((completedSteps / totalSteps) * 100) : 0,
    totalSteps,
  };
}

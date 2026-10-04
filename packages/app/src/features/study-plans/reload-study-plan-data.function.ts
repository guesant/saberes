export interface ReloadStudyPlanInput<PlanResult, ProgressResult> {
  reloadPlan(): Promise<PlanResult>;

  reloadProgress(): Promise<ProgressResult>;
}

export async function reloadStudyPlanData<PlanResult, ProgressResult>(
  input: ReloadStudyPlanInput<PlanResult, ProgressResult>,
): Promise<void> {
  await Promise.all([input.reloadPlan(), input.reloadProgress()]);
}

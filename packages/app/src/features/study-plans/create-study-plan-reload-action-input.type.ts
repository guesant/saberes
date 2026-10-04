export type CreateStudyPlanReloadActionInput = {
  reloadPlan: () => Promise<unknown>;
  reloadProgress: () => Promise<unknown>;
};

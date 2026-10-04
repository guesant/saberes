export type StudyPlanProgressSummaryProps = {
  completedSteps: number;
  percentage: number;
  totalSteps: number;
  nextStep: Record<string, unknown> | null;
};

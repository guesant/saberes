export type StudyPlanStepSkipActionProps = {
  stepId: string;
  disabled: boolean;
  onSkip: (stepId: string) => Promise<void>;
};

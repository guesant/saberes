export type StudyPlanStepSkipActionProps = {
  stepId: string;
  disabled: boolean;
  skipped: boolean;
  onSkip(stepId: string): Promise<void>;
};

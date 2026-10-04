export type StudyPlanStepMoveActionsProps = {
  stepId: string;
  onMove(stepId: string, direction: -1 | 1): Promise<void>;
};

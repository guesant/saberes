export interface CreateStudyGoalProgressAction {
  (contentKey: string, current: number): Promise<void>;
}

export interface StudyPlanActions {
  toggleStep(step: Record<string, unknown>, completed: boolean): Promise<void>;

  togglePause(): Promise<void>;

  updateStartDate(startDate: string): Promise<void>;

  updateTargetDate(targetDate: string): Promise<void>;

  updateDailyMinutes(dailyMinutes: number): Promise<void>;

  skipStep(stepId: string): Promise<void>;

  moveStep(stepId: string, direction: -1 | 1): Promise<void>;

  reload(): Promise<void>;
}

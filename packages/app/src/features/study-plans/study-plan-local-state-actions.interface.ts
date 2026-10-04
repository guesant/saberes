export interface StudyPlanLocalStateActions {
  togglePause: () => Promise<void>;
  updateStartDate: (startDate: string) => Promise<void>;
  updateTargetDate: (targetDate: string) => Promise<void>;
  updateDailyMinutes: (dailyMinutes: number) => Promise<void>;
  skipStep: (stepId: string) => Promise<void>;
}

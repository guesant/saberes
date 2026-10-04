export interface StudyPlanLocalStateActions {
  togglePause: () => Promise<void>;
  updateTargetDate: (targetDate: string) => Promise<void>;
  updateDailyMinutes: (dailyMinutes: number) => Promise<void>;
}

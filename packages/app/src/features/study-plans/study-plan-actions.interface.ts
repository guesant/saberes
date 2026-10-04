export interface StudyPlanActions {
  toggleStep: (step: Record<string, unknown>, completed: boolean) => Promise<void>;
  togglePause: () => Promise<void>;
  updateTargetDate: (targetDate: string) => Promise<void>;
  updateDailyMinutes: (dailyMinutes: number) => Promise<void>;
  reload: () => Promise<void>;
}

import type { StudyPlanLocalState } from "./study-plan-local-state.interface";

export type StudyPlanControlsProps = {
  state: StudyPlanLocalState;
  onTogglePause: () => Promise<void>;
  onTargetDateChange: (targetDate: string) => Promise<void>;
  onDailyMinutesChange: (dailyMinutes: number) => Promise<void>;
};

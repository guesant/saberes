export interface StudyPlanLocalState {
  status: "active" | "paused" | "completed";
  startDate: string;
  targetDate: string;
  dailyMinutes: number;
  orderedStepIds: string[];
  skippedStepIds: string[];
}

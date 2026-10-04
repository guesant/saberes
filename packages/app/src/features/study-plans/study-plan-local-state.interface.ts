export interface StudyPlanLocalState {
  status: "active" | "paused" | "completed";
  targetDate: string;
  dailyMinutes: number;
  orderedStepIds: string[];
}

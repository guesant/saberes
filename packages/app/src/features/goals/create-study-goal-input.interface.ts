import type { StudyGoalMetric } from "@guesant/saberes-application";

export interface CreateStudyGoalInput {
  title: string;
  target: number;
  metric: StudyGoalMetric;
  dueAt: string;
}

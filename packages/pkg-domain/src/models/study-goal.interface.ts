import type { StudyGoalMetric, StudyGoalStatus } from "./domain.enums";

export interface StudyGoal {
  contentKey: string;
  title: string;
  metric: StudyGoalMetric;
  target: number;
  current: number;
  status: StudyGoalStatus;
  dueAt?: string;
  createdAt: string;
  updatedAt: string;
}

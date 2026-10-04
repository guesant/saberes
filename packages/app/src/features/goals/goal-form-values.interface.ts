import type { GoalFormDetails } from "./goal-form-details.interface";
import type { GoalFormMilestone } from "./goal-form-milestone.interface";
import type { StudyGoalMetric } from "@guesant/saberes-application";

export interface GoalFormValues {
  details: GoalFormDetails;
  metric: StudyGoalMetric;
  milestones: GoalFormMilestone[];
}

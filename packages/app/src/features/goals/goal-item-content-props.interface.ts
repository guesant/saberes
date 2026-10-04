import type { GoalItemProps } from "./goal-item-props.interface";
import type { StudyGoalTiming } from "./study-goal-timing.type";

export interface GoalItemContentProps extends GoalItemProps {
  current: string;
  timing: StudyGoalTiming;
  onCurrentChange(value: string): void;

  onSaveProgress(): Promise<void>;
}

import { UIButton } from "@guesant/saberes-ui";
import type { StudyGoalMetric } from "@guesant/saberes-application";

export interface GoalMetricButtonProps {
  metric: StudyGoalMetric;
  selected: boolean;
  label: string;
  onSelect(metric: StudyGoalMetric): void;
}

export function GoalMetricButton(props: GoalMetricButtonProps) {
  return (
    <UIButton
      onClick={() => {
        return props.onSelect(props.metric);
      }}
      variant={props.selected ? "contained" : "outlined"}
    >
      {props.label}
    </UIButton>
  );
}

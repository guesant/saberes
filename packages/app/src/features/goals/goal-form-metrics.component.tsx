import { StudyGoalMetric } from "@guesant/saberes-application";
import { UIContentGroup } from "@guesant/saberes-ui";
import { GoalMetricButton } from "./goal-metric-button.component";
import type { GoalFormApi } from "./goal-form-api.type";

export interface GoalFormMetricsProps {
  labels: Record<StudyGoalMetric, string>;
  form: GoalFormApi;
}

export function GoalFormMetrics(props: GoalFormMetricsProps) {
  const { form } = props;

  return (
    <UIContentGroup variant="inline">
      <form.Field name="metric">
        {(field) => {
          return Object.values(StudyGoalMetric)
            .map((metric) => {
              return (
                <GoalMetricButton
                  key={metric}
                  label={props.labels[metric]}
                  metric={metric}
                  onSelect={field.handleChange}
                  selected={field.state.value === metric}
                />
              );
            });
        }}
      </form.Field>
    </UIContentGroup>
  );
}

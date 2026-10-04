import { StudyGoalMetric } from "@guesant/saberes-application";
import { UIButton } from "@guesant/saberes-ui";
import { GoalFormMetrics } from "./goal-form-metrics.component";
import { GoalFormTextFields } from "./goal-form-text-fields.component";
import type { GoalFormApi } from "./goal-form-api.type";

export interface GoalFormFieldsProps {
  titleLabel: string;
  targetLabel: string;
  createLabel: string;
  dueAtLabel: string;
  metricLabels: Record<StudyGoalMetric, string>;
  form: GoalFormApi;
  existingTitles: string[];
}

export function GoalFormFields(props: GoalFormFieldsProps) {
  return (
    <>
      <GoalFormTextFields
        dueAtLabel={props.dueAtLabel}
        existingTitles={props.existingTitles}
        form={props.form}
        targetLabel={props.targetLabel}
        titleLabel={props.titleLabel}
      />
      <GoalFormMetrics labels={props.metricLabels} form={props.form} />
      <props.form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <UIButton disabled={!canSubmit || isSubmitting} type="submit" variant="contained">
            {isSubmitting ? "..." : props.createLabel}
          </UIButton>
        )}
      </props.form.Subscribe>
    </>
  );
}

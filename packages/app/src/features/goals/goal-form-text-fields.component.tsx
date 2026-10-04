import { UIResponsiveFields } from "@guesant/saberes-ui";
import { GoalFormDueDateField } from "./goal-form-due-date-field.component";
import { GoalFormTargetField } from "./goal-form-target-field.component";
import { GoalFormTitleField } from "./goal-form-title-field.component";
import type { GoalFormApi } from "./goal-form-api.type";

export interface GoalFormTextFieldsProps {
  titleLabel: string;
  targetLabel: string;
  dueAtLabel: string;
  form: GoalFormApi;
  existingTitles: string[];
}

export function GoalFormTextFields(props: GoalFormTextFieldsProps) {
  return (
    <UIResponsiveFields>
      <GoalFormTitleField
        existingTitles={props.existingTitles}
        form={props.form}
        label={props.titleLabel}
      />
      <GoalFormTargetField form={props.form} label={props.targetLabel} />
      <GoalFormDueDateField form={props.form} label={props.dueAtLabel} />
    </UIResponsiveFields>
  );
}

import { UITextField } from "@guesant/saberes-ui";
import type { GoalFormApi } from "./goal-form-api.type";

export interface GoalFormDueDateFieldProps {
  form: GoalFormApi;
  label: string;
}

export function GoalFormDueDateField(props: GoalFormDueDateFieldProps) {
  const { form } = props;

  return (
    <form.Field name="details.dueAt">
      {(field) => (
        <UITextField
          fullWidth
          label={props.label}
          onBlur={field.handleBlur}
          onChange={(event) => field.handleChange(event.target.value)}
          type="date"
          value={field.state.value}
        />
      )}
    </form.Field>
  );
}

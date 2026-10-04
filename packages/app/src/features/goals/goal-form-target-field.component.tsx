import { UITextField } from "@guesant/saberes-ui";
import type { GoalFormApi } from "./goal-form-api.type";

export interface GoalFormTargetFieldProps {
  form: GoalFormApi;
  label: string;
}

export function GoalFormTargetField(props: GoalFormTargetFieldProps) {
  const { form } = props;

  return (
    <form.Field
      name="details.target"
      validators={{
        onChange: ({ value }) =>
          Number(value) > 0 ? undefined : "Informe uma quantidade maior que zero.",
      }}
    >
      {(field) => (
        <UITextField
          error={!field.state.meta.isValid}
          fullWidth
          helperText={field.state.meta.errors.join(", ")}
          inputProps={{ min: 1, step: 1 }}
          label={props.label}
          onBlur={field.handleBlur}
          onChange={(event) => field.handleChange(event.target.value)}
          type="number"
          value={field.state.value}
        />
      )}
    </form.Field>
  );
}

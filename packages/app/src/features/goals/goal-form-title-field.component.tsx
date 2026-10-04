import { UITextField } from "@guesant/saberes-ui";
import type { GoalFormApi } from "./goal-form-api.type";

export interface GoalFormTitleFieldProps {
  form: GoalFormApi;
  existingTitles: string[];
  label: string;
}

export function GoalFormTitleField(props: GoalFormTitleFieldProps) {
  const { form } = props;

  return (
    <form.Field
      asyncDebounceMs={350}
      name="details.title"
      validators={{
        onBlur: ({ value }) => (value.trim() ? undefined : "Informe um título."),
        onChangeAsync: async ({ value }) => {
          const normalizedValue = value.trim().toLocaleLowerCase();

          const alreadyExists = props.existingTitles.some(
            (title) => title.trim().toLocaleLowerCase() === normalizedValue,
          );

          return alreadyExists ? "Já existe uma meta com este título." : undefined;
        },
      }}
    >
      {(field) => (
        <UITextField
          error={!field.state.meta.isValid}
          fullWidth
          helperText={field.state.meta.errors.join(", ")}
          label={props.label}
          onBlur={field.handleBlur}
          onChange={(event) => field.handleChange(event.target.value)}
          value={field.state.value}
        />
      )}
    </form.Field>
  );
}

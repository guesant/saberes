import { UITextField } from "@guesant/saberes-ui";

export interface AcademicDisciplineTextFieldProps {
  inputMin?: number;
  inputStep?: number;
  label: string;
  onChange(value: string): void;
  type?: "number";
  value: string;
}

export function AcademicDisciplineTextField(props: AcademicDisciplineTextFieldProps) {
  return (
    <UITextField
      fullWidth
      inputProps={{ min: props.inputMin, step: props.inputStep }}
      label={props.label}
      onChange={(event) => {
        return props.onChange(event.target.value);
      }}
      type={props.type}
      value={props.value}
    />
  );
}

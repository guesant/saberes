import { UITextField } from "@guesant/saberes-ui";

export interface AcademicDisciplineTextFieldProps {
  inputMin?: number;
  inputStep?: number;
  label: string;
  onChange(value: string): void;
  required?: boolean;
  type?: "number";
  value: string;
}

export function AcademicDisciplineTextField(props: AcademicDisciplineTextFieldProps) {
  return (
    <UITextField
      inputProps={{ min: props.inputMin, step: props.inputStep }}
      label={props.label}
      onChange={(event) => {
        return props.onChange(event.target.value);
      }}
      type={props.type}
      required={props.required}
      value={props.value}
    />
  );
}

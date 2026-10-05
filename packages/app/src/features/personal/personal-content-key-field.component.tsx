import { UITextField } from "@guesant/saberes-ui";

export interface PersonalContentKeyFieldProps {
  value: string;
  onChange(value: string): void;
}

export function PersonalContentKeyField(props: PersonalContentKeyFieldProps) {
  return (
    <UITextField
      label="Referência relacionada (opcional)"
      onChange={(event) => {
        return props.onChange(event.target.value);
      }}
      value={props.value}
    />
  );
}

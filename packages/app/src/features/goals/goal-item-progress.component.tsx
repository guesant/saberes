import { UIButton, UIResponsiveFields, UITextField } from "@guesant/saberes-ui";

export interface GoalItemProgressProps {
  current: string;
  target: number;
  label: string;
  updateLabel: string;
  onChange(value: string): void;

  onSave(): Promise<void>;
}

export function GoalItemProgress(props: GoalItemProgressProps) {
  return (
    <UIResponsiveFields>
      <UITextField
        inputProps={{ max: props.target, min: 0, step: 1 }}
        label={props.label}
        onChange={(event) => props.onChange(event.target.value)}
        type="number"
        value={props.current}
      />
      <UIButton onClick={props.onSave} variant="outlined">
        {props.updateLabel}
      </UIButton>
    </UIResponsiveFields>
  );
}

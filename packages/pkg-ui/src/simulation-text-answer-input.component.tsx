import { UITextField } from "./text-field.component";
import type { UISimulationTextAnswerInputProps } from "./simulation-text-answer-input-props.interface";

export function UISimulationTextAnswerInput(props: UISimulationTextAnswerInputProps) {
  const multiline = ["discursive", "essay"].includes(props.questionType);

  return (
    <UITextField
      label="Sua resposta"
      multiline={multiline}
      minRows={multiline ? 5 : 1}
      value={props.value}
      disabled={props.disabled}
      onChange={(event) => { return props.onChange(event.target.value); }}
    />
  );
}

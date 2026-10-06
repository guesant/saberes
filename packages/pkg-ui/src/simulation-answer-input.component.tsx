import { UISimulationChoiceInput } from "./simulation-choice-input.component";
import { UISimulationTextAnswerInput } from "./simulation-text-answer-input.component";
import type { UISimulationAnswerInputProps } from "./simulation-answer-input-props.interface";

export function UISimulationAnswerInput(props: UISimulationAnswerInputProps) {
  const isChoice = props.options.length > 0 && ["single_choice", "multiple_choice", "true_false"].includes(props.questionType);

  if (isChoice) {
    return <UISimulationChoiceInput {...props} />;
  }

  return <UISimulationTextAnswerInput {...props} />;
}

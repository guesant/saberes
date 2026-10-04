import { QuestionChoiceAnswerInput } from "./question-choice-answer-input.component";
import { QuestionTextAnswerInput } from "./question-text-answer-input.component";
import type { QuestionAnswerInputProps } from "./question-answer-input-props.type";

export function QuestionAnswerInput(props: QuestionAnswerInputProps) {
  if (
    (props.questionType === "single_choice" ||
      props.questionType === "multiple_choice" ||
      props.questionType === "true_false") &&
    props.options.length > 0
  ) {
    return (
      <QuestionChoiceAnswerInput
        questionType={props.questionType}
        options={props.options}
        value={props.value}
        onChange={props.onChange}
      />
    );
  }

  return (
    <QuestionTextAnswerInput
      questionType={props.questionType}
      options={props.options}
      value={props.value}
      onChange={props.onChange}
    />
  );
}

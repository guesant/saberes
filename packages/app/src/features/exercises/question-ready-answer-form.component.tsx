import { QuestionAnswerInput } from "./question-answer-input.component";
import { QuestionConfidenceInput } from "./question-confidence-input.component";
import { QuestionSubmitAction } from "./question-submit-action.component";
import type { QuestionReadyAnswerFormProps } from "./question-ready-answer-form-props.interface";

export function QuestionReadyAnswerForm(props: QuestionReadyAnswerFormProps) {
  const { answer, confidence, data, onAnswerChange, onConfidenceChange, onSubmit } = props;

  return (
    <>
      <QuestionAnswerInput
        questionType={String(data.question.type || "single_choice")}
        options={data.options}
        value={answer || ""}
        onChange={onAnswerChange}
      />

      <QuestionConfidenceInput onChange={onConfidenceChange} value={confidence} />

      <QuestionSubmitAction
        answer={answer}
        confidence={confidence !== null}
        onSubmit={onSubmit}
        submitting={props.submitting}
      />
    </>
  );
}

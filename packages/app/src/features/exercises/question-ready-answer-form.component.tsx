import { UIContentGroup } from "@guesant/saberes-ui";
import { QuestionAnswerInput } from "./question-answer-input.component";
import { QuestionResponseAction } from "./question-response-action.component";
import type { QuestionReadyAnswerFormProps } from "./question-ready-answer-form-props.interface";

export function QuestionReadyAnswerForm(props: QuestionReadyAnswerFormProps) {
  const { answer, confidence, data, onAnswerChange, onConfidenceChange, onSubmit } = props;

  return (
    <UIContentGroup variant="section">
      <QuestionAnswerInput
        questionType={String(data.question.type || "single_choice")}
        options={data.options}
        value={answer || ""}
        disabled={props.readOnly}
        onChange={onAnswerChange}
      />

      <QuestionResponseAction
        answer={answer}
        confidence={confidence}
        onConfidenceChange={onConfidenceChange}
        onSubmit={onSubmit}
        readOnly={props.readOnly}
        submitting={props.submitting}
      />
    </UIContentGroup>
  );
}

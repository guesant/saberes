import type { QuestionReadyContentProps } from "./question-ready-content-props.type";

export interface QuestionReadyAnswerFormProps
  extends Pick<
    QuestionReadyContentProps,
  "answer" | "confidence" | "data" | "onAnswerChange" | "onConfidenceChange" | "onSubmit"
  > {
  readOnly: boolean;
  submitting: boolean;
}

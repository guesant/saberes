import type { QuestionReadyAnswerFormProps } from "./question-ready-answer-form-props.interface";

export interface QuestionResponseActionProps extends Pick<
  QuestionReadyAnswerFormProps,
  "answer" | "confidence" | "onConfidenceChange" | "onSubmit" | "readOnly" | "submitting"
> {}

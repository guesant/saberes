import type { QuestionReadyContentProps } from "./question-ready-content-props.type";

export type QuestionReadyAnswerFormProps = Pick<
  QuestionReadyContentProps,
  "answer" | "confidence" | "data" | "onAnswerChange" | "onConfidenceChange" | "onSubmit"
>;

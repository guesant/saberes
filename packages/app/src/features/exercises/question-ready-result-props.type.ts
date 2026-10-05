import type { QuestionReadyContentProps } from "./question-ready-content-props.type";

export type QuestionReadyResultProps = Pick<
  QuestionReadyContentProps,
  "data" | "onContinue" | "onDiagnose" | "onRetry" | "result"
>;

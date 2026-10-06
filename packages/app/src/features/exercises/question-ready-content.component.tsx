import { QuestionReadyContentBody } from "./question-ready-content-body.component";
import type { QuestionReadyContentProps } from "./question-ready-content-props.type";

export function QuestionReadyContent(props: QuestionReadyContentProps) {
  return (
    <QuestionReadyContentBody content={props} />
  );
}

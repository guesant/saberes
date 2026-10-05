import { UICard } from "@guesant/saberes-ui";
import { QuestionReadyContentBody } from "./question-ready-content-body.component";
import type { QuestionReadyContentProps } from "./question-ready-content-props.type";

export function QuestionReadyContent(props: QuestionReadyContentProps) {
  return (
    <UICard>
      <QuestionReadyContentBody content={props} />
    </UICard>
  );
}

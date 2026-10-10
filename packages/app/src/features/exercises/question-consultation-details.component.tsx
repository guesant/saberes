import { UIContentGroup } from "@guesant/saberes-ui";
import { QuestionConsultationAnswerKey } from "./question-consultation-answer-key.component";
import { QuestionSolutions } from "./question-solutions.component";
import type { QuestionReadModel } from "@guesant/saberes-application";

export type QuestionConsultationDetailsProps = {
  data: QuestionReadModel;
};

export function QuestionConsultationDetails(props: QuestionConsultationDetailsProps) {
  if (props.data.question.training_eligible !== false) {
    return null;
  }

  return (
    <UIContentGroup variant="content">
      <QuestionConsultationAnswerKey answer={props.data.question.correct_answer} />
      <QuestionSolutions solutions={props.data.solutions} />
    </UIContentGroup>
  );
}

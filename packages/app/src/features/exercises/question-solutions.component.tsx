import { UIContentGroup } from "@guesant/saberes-ui";
import { QuestionSolutionItem } from "./question-solution-item.component";
import type { QuestionReadModel } from "@guesant/saberes-application";

export type QuestionSolutionsProps = {
  solutions?: QuestionReadModel["solutions"];
};

export function QuestionSolutions(props: QuestionSolutionsProps) {
  if (!props.solutions?.length) {
    return null;
  }

  return (
    <UIContentGroup variant="content">
      {props.solutions.map((solution) => {return (
        <QuestionSolutionItem key={solution.id} solution={solution} />
      );})}
    </UIContentGroup>
  );
}

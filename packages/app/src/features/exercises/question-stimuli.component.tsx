import { UIContentGroup } from "@guesant/saberes-ui";
import { QuestionStimulusItem } from "./question-stimulus-item.component";
import type { QuestionContextReadModel } from "@guesant/saberes-application";

export type QuestionStimuliProps = {
  contexts: QuestionContextReadModel[];
};

export function QuestionStimuli(props: QuestionStimuliProps) {
  if (props.contexts.length === 0) {
    return null;
  }

  return (
    <UIContentGroup variant="content">
      {props.contexts.map((context) => {
        return <QuestionStimulusItem context={context} key={context.id} />;
      })}
    </UIContentGroup>
  );
}

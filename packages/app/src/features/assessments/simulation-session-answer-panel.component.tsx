import { UISimulationAnswerInput } from "@guesant/saberes-ui";
import { UIQuestionRichText } from "@guesant/saberes-ui-content";
import type { SimulationSessionAnswerPanelProps } from "./simulation-session-answer-panel-props.interface";

export function SimulationSessionAnswerPanel(props: SimulationSessionAnswerPanelProps) {
  const {question} = props;

  return (
    <>
      <UIQuestionRichText text={question.question.statement || ""} />
      <UISimulationAnswerInput
        questionType={question.question.type || "discursive"}
        options={question.options.map((option) => { return { id: option.id, code: option.code, value: option.canonicalCode, text: option.text }; })}
        value={props.viewModel.answer}
        disabled={props.viewModel.busy || props.viewModel.expired}
        onChange={props.viewModel.changeAnswer}
      />
    </>
  );
}

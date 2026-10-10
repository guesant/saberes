import { UIAlert, UISimulationAnswerInput } from "@guesant/saberes-ui";
import { UIQuestionRichText } from "@guesant/saberes-ui-content";
import { useTranslation } from "react-i18next";
import type { SimulationSessionAnswerPanelProps } from "./simulation-session-answer-panel-props.interface";

export function SimulationSessionAnswerPanel(props: SimulationSessionAnswerPanelProps) {
  const { t } = useTranslation();
  const {question} = props;

  return (
    <>
      <UIQuestionRichText text={question.question.statement || ""} />
      {question.question.answer_status === "cancelled"
        ? <UIAlert severity="info">{t("simulator.cancelledQuestion")}</UIAlert>
        : <UISimulationAnswerInput
        questionType={question.question.type || "discursive"}
        options={question.options.map((option) => { return { id: option.id, code: option.code, value: option.canonicalCode, text: option.text }; })}
        value={props.viewModel.answer}
        disabled={props.viewModel.busy || props.viewModel.expired}
        onChange={props.viewModel.changeAnswer}
        />}
    </>
  );
}

import { UIButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { QuestionAnswerInput } from "./question-answer-input.component";
import { QuestionConfidenceInput } from "./question-confidence-input.component";
import type { QuestionReadyAnswerFormProps } from "./question-ready-answer-form-props.type";

export function QuestionReadyAnswerForm(props: QuestionReadyAnswerFormProps) {
  const { answer, confidence, data, onAnswerChange, onConfidenceChange, onSubmit } = props;

  const { t } = useTranslation();

  return (
    <>
      <QuestionAnswerInput
        questionType={String(data.question.type || "single_choice")}
        options={data.options}
        value={answer || ""}
        onChange={onAnswerChange}
      />

      <QuestionConfidenceInput onChange={onConfidenceChange} value={confidence} />

      <UIButton
        variant="contained"
        disabled={!answer?.trim() || confidence === null}
        onClick={onSubmit}
      >
        {t("exercise.respond")}
      </UIButton>
    </>
  );
}

import { UITextField } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { QuestionTextAnswerInputProps } from "./question-text-answer-input-props.type";

export function QuestionTextAnswerInput(props: QuestionTextAnswerInputProps) {
  const isLongText = ["discursive", "essay"].includes(props.questionType);

  const { t } = useTranslation();

  return (
    <UITextField
      multiline={isLongText}
      minRows={isLongText ? 5 : 1}
      label={t("exercise.answerLabel")}
      value={props.value}
      onChange={(event) => {
        return props.onChange(event.target.value);
      }}
    />
  );
}

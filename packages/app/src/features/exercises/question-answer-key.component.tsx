import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export type QuestionAnswerKeyProps = {
  answer: string;
};

export function QuestionAnswerKey(props: QuestionAnswerKeyProps) {
  const { t } = useTranslation();

  return (
    <UITypography color="error.main">
      {t("exercise.answerKey", { answer: props.answer })}
    </UITypography>
  );
}

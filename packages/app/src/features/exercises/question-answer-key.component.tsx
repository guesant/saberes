import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";

export type QuestionAnswerKeyProps = {
  answer: string;
};

export function QuestionAnswerKey(props: QuestionAnswerKeyProps): ReactNode {
  const { t } = useTranslation();

  if (!props.answer.trim()) {
    return null;
  }

  return (
    <UITypography color="text.secondary">
      {t("exercise.answerKey", { answer: props.answer })}
    </UITypography>
  );
}

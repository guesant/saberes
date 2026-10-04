import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export type QuestionExplanationProps = {
  explanation: string;
};

export function QuestionExplanation(props: QuestionExplanationProps) {
  const { t } = useTranslation();

  return (
    <UITypography hidden={!props.explanation}>
      {props.explanation || t("exercise.noExplanation")}
    </UITypography>
  );
}

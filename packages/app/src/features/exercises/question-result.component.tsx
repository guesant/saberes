import { Typography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export type QuestionResultProps = {
  result: boolean;
};

export function QuestionResult(props: QuestionResultProps) {
  const { t } = useTranslation();

  return (
    <Typography color={props.result ? "success.main" : "error.main"}>
      {props.result ? t("exercise.correct") : t("exercise.incorrect")}
    </Typography>
  );
}

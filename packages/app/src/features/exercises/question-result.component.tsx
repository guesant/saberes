import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export type QuestionResultProps = {
  result: boolean | null;
};

export function QuestionResult(props: QuestionResultProps) {
  const { t } = useTranslation();

  let color = "error.main";

  let labelKey = "exercise.incorrect";

  if (props.result === null) {
    color = "info.main";

    labelKey = "exercise.registeredForReview";
  } else if (props.result) {
    color = "success.main";

    labelKey = "exercise.correct";
  }

  return <UITypography color={color}>{t(labelKey)}</UITypography>;
}

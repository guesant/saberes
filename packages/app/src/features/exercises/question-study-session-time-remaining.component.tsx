import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export interface QuestionStudySessionTimeRemainingProps {
  seconds: number;
}

export function QuestionStudySessionTimeRemaining(props: QuestionStudySessionTimeRemainingProps) {
  const { t } = useTranslation();

  return (
    <UITypography>{t("exercise.sessionTimeRemaining", { seconds: props.seconds })}</UITypography>
  );
}

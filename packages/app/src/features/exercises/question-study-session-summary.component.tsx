import { UIButton, UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { QuestionSessionProgress } from "./get-question-session-progress.function";

export type QuestionStudySessionSummaryProps = {
  progress: QuestionSessionProgress;
  onBack: () => void;
  onReview: () => void;
};

export function QuestionStudySessionSummary(props: QuestionStudySessionSummaryProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="section">
      <UITypography variant="h4">{t("exercise.sessionSummary")}</UITypography>
      <UITypography>
        {t("exercise.sessionAnswered", {
          answered: props.progress.answered,
          total: props.progress.total,
        })}
      </UITypography>
      <UITypography>
        {t("exercise.sessionCorrect", { correct: props.progress.correct })}
      </UITypography>
      <UITypography>
        {t("exercise.sessionNextAction", {
          percentage: props.progress.percentage,
        })}
      </UITypography>
      <UIButton variant="contained" onClick={props.onReview}>
        {t("exercise.sessionReviewAction")}
      </UIButton>
      <UIButton variant="outlined" onClick={props.onBack}>
        {t("common.backToMyStudy")}
      </UIButton>
    </UIContentGroup>
  );
}

import { UIAlert } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export type AssessmentConsultationNoticeProps = {
  canPractice?: boolean;
  canSimulate?: boolean;
  hasCancelledQuestions?: boolean;
};

export function AssessmentConsultationNotice(props: AssessmentConsultationNoticeProps) {
  const { t } = useTranslation();

  if (props.canPractice !== false && !props.hasCancelledQuestions) {
    return null;
  }

  let message = t("assessment.consultationOnlyNotice");

  if (props.canSimulate) {
    message = t("assessment.cancelledSimulationNotice");
  } else if (props.canPractice) {
    message = t("assessment.cancelledPracticeNotice");
  }

  return <UIAlert severity="info">{message}</UIAlert>;
}

import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { getAssessmentTrainingAvailabilityMessageKey } from "./get-assessment-training-availability-message-key.function";
import type { AssessmentDetailsReadModel } from "@guesant/saberes-application";

export type AssessmentTrainingAvailabilityProps = {
  assessment: AssessmentDetailsReadModel;
};

export function AssessmentTrainingAvailability(props: AssessmentTrainingAvailabilityProps) {
  const {t} = useTranslation();

  const messageKey = getAssessmentTrainingAvailabilityMessageKey(props.assessment);

  let label = String(t(messageKey));

  if (messageKey.startsWith("assessment.simulation")) {
    label = String(t(messageKey, {minutes: props.assessment.duration_minutes}));
  }

  return <UITypography>{label}</UITypography>;
}

import type { AssessmentDetailsReadModel } from "@guesant/saberes-application";

type AssessmentTrainingAvailabilityMessageKey =
  | "assessment.simulationWithCancelledItemAvailable"
  | "assessment.simulationAvailable"
  | "assessment.consultationOnlyNotice"
  | "assessment.practiceWithCancelledItemAvailable"
  | "assessment.simulationUnavailable";

export function getAssessmentTrainingAvailabilityMessageKey(
  assessment: AssessmentDetailsReadModel,
): AssessmentTrainingAvailabilityMessageKey {
  const hasCancelledQuestions = Boolean(assessment.cancelledQuestionCount);

  if (assessment.canSimulate) {
    if (hasCancelledQuestions) {
      return "assessment.simulationWithCancelledItemAvailable";
    }

    return "assessment.simulationAvailable";
  }

  if (assessment.canPractice === false) {
    return "assessment.consultationOnlyNotice";
  }

  if (hasCancelledQuestions) {
    return "assessment.practiceWithCancelledItemAvailable";
  }

  return "assessment.simulationUnavailable";
}

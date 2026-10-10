import type { AssessmentDetailsReadModel } from "@guesant/saberes-application";

export function getAssessmentPracticeQuestionKeys(
  assessment: AssessmentDetailsReadModel,
  fallbackQuestionKeys: string[],
): string[] {
  if (assessment.canPractice === false) {
    return [];
  }

  const questionKeys = assessment.practiceQuestionKeys ?? fallbackQuestionKeys;

  return [...new Set(questionKeys)];
}

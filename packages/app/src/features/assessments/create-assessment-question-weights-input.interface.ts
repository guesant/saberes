import type { AssessmentItemReadModel } from "@guesant/saberes-application";

export interface CreateAssessmentQuestionWeightsInput {
  questionKeys: string[];
  items: AssessmentItemReadModel[];
}

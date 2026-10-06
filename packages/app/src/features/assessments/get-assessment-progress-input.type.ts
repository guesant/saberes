import type { Attempt, AssessmentItemReadModel } from "@guesant/saberes-application";

export type GetAssessmentProgressInput = {
  attempts: Attempt[];
  items: AssessmentItemReadModel[];
};

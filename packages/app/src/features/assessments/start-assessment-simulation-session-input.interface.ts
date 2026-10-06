import type { AssessmentDetailsReadModel, AssessmentItemReadModel, ApplicationServices } from "@guesant/saberes-application";

export interface StartAssessmentSimulationSessionInput {
  assessmentKey: string;
  assessment: AssessmentDetailsReadModel;
  items: AssessmentItemReadModel[];
  services: ApplicationServices;
  navigate(path: string): void;
}

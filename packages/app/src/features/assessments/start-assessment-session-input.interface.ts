import type { ApplicationServices, AssessmentDetailsReadModel, AssessmentItemReadModel } from "@guesant/saberes-application";
import type { NavigateFunction } from "react-router-dom";

export interface StartAssessmentSessionInput {
  assessmentKey: string;
  assessment: AssessmentDetailsReadModel;
  items: AssessmentItemReadModel[];
  questionKeys: string[];
  services: ApplicationServices;
  navigate: NavigateFunction;
  mode: "practice" | "simulation";
}

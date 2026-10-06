import type { AssessmentDetailsReadModel, AssessmentItemReadModel } from "@guesant/saberes-application";

export interface AssessmentSessionLauncherProps {
  assessmentKey: string;
  assessment: AssessmentDetailsReadModel;
  items: AssessmentItemReadModel[];
}

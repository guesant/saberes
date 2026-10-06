import type { AssessmentDetailsReadModel } from "./assessment-details-read-model.interface";
import type { AssessmentItemReadModel } from "./assessment-item-read-model.interface";

export interface AssessmentReadModel {
  assessment: AssessmentDetailsReadModel;
  items: AssessmentItemReadModel[];
}

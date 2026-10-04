import type { GetAssessmentQueryHandler } from "../queries/get-assessment.query-handler";

export type AssessmentServices = {
  get: GetAssessmentQueryHandler;
};

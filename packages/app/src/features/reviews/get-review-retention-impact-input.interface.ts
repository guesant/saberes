import type { ReviewLoadSummary } from "./review-load-summary.interface";

export interface GetReviewRetentionImpactInput {
  load: ReviewLoadSummary;
  retention: number;
}

import type { ReviewTarget } from "./review-target.interface";

export interface PreviewReviewInput {
  target: ReviewTarget;
  now?: Date;
  requestRetention?: number;
}

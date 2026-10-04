import { getDueReviewTargets } from "./get-due-review-targets.function";
import { getReviewLoadSummary } from "./get-review-load-summary.function";
import type { ReviewLoadSummary } from "./review-load-summary.interface";
import type { ReviewTarget } from "@guesant/saberes-application";

export function getReviewQueueState(
  reviewTargets: ReviewTarget[],
  now: Date,
): { targets: ReviewTarget[]; load: ReviewLoadSummary } {
  return {
    targets: getDueReviewTargets(reviewTargets, now),
    load: getReviewLoadSummary(reviewTargets, now),
  };
}

import { getDueReviewTargets } from "./get-due-review-targets.function";
import { getReviewLoadSummary } from "./get-review-load-summary.function";
import type { ReviewQueueState } from "./review-queue-state.interface";
import type { ReviewTarget } from "@guesant/saberes-application";

export function getReviewQueueState(reviewTargets: ReviewTarget[], now: Date): ReviewQueueState {
  return {
    targets: getDueReviewTargets(reviewTargets, now),
    load: getReviewLoadSummary(reviewTargets, now),
  };
}

import type { ReviewLoadSummary } from "./review-load-summary.interface";
import type { ReviewTarget } from "@guesant/saberes-application";

export interface ReviewQueueState {
  targets: ReviewTarget[];
  load: ReviewLoadSummary;
}

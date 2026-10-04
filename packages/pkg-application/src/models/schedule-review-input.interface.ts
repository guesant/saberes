import type { ReviewTarget } from "./review-target.interface";
import type { FsrsRating } from "@guesant/saberes-domain";

export interface ScheduleReviewInput {
  target: ReviewTarget;
  rating: FsrsRating;
  now?: Date;
  requestRetention?: number;
}

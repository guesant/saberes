import type { ReviewTarget } from "../models/index";
import type { FsrsRating } from "@guesant/saberes-domain";

export interface ScheduleReviewPort {
  execute(input: {
    target: ReviewTarget;
    rating: FsrsRating;
    now?: Date;
    requestRetention?: number;
  }): ReviewTarget;
}

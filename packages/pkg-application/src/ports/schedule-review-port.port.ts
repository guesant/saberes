import type { ReviewTarget } from "../models/progress.models.ts";
import type { FsrsRating } from "@guesant/saberes-domain";

export interface ScheduleReviewPort {
  execute(input: { target: ReviewTarget; rating: FsrsRating; now?: Date }): ReviewTarget;
}

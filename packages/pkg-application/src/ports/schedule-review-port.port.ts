import type { ScheduleReviewInput, ReviewTarget } from "../models/index";

export interface ScheduleReviewPort {
  execute(input: ScheduleReviewInput): ReviewTarget;
}

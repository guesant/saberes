import type { ReviewDateFactory } from "./revive-review-card.function.ts";

export type ScheduleReviewOptions = {
  now: Date;
  createDate: ReviewDateFactory;
};

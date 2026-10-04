import type { ReviewDateFactory } from "./revive-review-card.function";

export type ScheduleReviewOptions = {
  now: Date;
  createDate: ReviewDateFactory;
  requestRetention: number;
};

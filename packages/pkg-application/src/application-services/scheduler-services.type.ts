import type { ScheduleReviewCommandHandler } from "../commands/schedule-review.command-handler";
import type { PreviewReviewQueryHandler } from "../queries/preview-review.query-handler";

export type SchedulerServices = {
  schedule: ScheduleReviewCommandHandler;
  preview: PreviewReviewQueryHandler;
};

import { scheduleReview } from "./schedule-review.function";
import type { ScheduleReviewPort, ReviewTarget } from "@guesant/saberes-application";

export class TsFsrsScheduleReviewAdapter implements ScheduleReviewPort {
  public execute(input: Parameters<ScheduleReviewPort["execute"]>[0]): ReviewTarget {
    return scheduleReview(input.target as never, input.rating, {
      now: input.now || new Date(),
      createDate: (value) => new Date(value),
    }) as ReviewTarget;
  }
}

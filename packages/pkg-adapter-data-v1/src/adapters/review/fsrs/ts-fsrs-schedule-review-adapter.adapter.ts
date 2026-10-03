import { scheduleReview } from "./schedule-review.function";
import type { ScheduleReviewPort, ReviewTarget } from "@guesant/saberes-application";

export class TsFsrsScheduleReviewAdapter implements ScheduleReviewPort {
  public execute(input: Parameters<ScheduleReviewPort["execute"]>[0]): ReviewTarget {
    // awkward-type-ignore: ts-fsrs exposes a structurally compatible target through an external generic boundary
    return scheduleReview(input.target as never, input.rating, {
      now: input.now || new Date(),
      createDate: (value) => new Date(value),
    }) as ReviewTarget;
  }
}

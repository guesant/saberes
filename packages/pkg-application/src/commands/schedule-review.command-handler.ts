import type { ReviewTarget } from "../models/index";
import type { ScheduleReviewPort } from "../ports/index";
import type { FsrsRating } from "@guesant/saberes-domain";

export interface ReviewScheduleInput {
  target: ReviewTarget;
  rating: FsrsRating;
  now?: Date;
}

export class ScheduleReviewCommandHandler {
  public constructor(private readonly port: ScheduleReviewPort) {}

  public execute(input: Parameters<ScheduleReviewPort["execute"]>[0]): ReviewTarget {
    return this.port.execute(input);
  }
}

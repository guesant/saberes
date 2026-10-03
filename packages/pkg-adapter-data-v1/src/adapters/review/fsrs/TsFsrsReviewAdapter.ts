import type { ReviewTarget, ReviewSchedulerPort } from "@guesant/saberes-application";
import type { FsrsRating } from "@guesant/saberes-domain";
import { previewReview, scheduleReview } from "../../../study/services";

export class TsFsrsReviewAdapter implements ReviewSchedulerPort {
    schedule(target: ReviewTarget, rating: FsrsRating, now = new Date()) {
        return scheduleReview(target as never, rating, now) as ReviewTarget;
    }

    preview(target: ReviewTarget, now = new Date()) {
        return previewReview(target as never, now);
    }
}

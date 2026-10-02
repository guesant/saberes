import type {
    ReviewTargetRecord,
    ReviewPreview,
    ReviewSchedulerPort,
} from "@guesant/saberes-core";
import {
    type FsrsRating,
    previewReview,
    scheduleReview,
} from "../../../study/services";

export class TsFsrsReviewAdapter implements ReviewSchedulerPort {
    schedule(target: ReviewTargetRecord, rating: FsrsRating, now: Date) {
        return scheduleReview(
            target as never,
            rating,
            now,
        ) as ReviewTargetRecord;
    }

    preview(target: ReviewTargetRecord, now: Date): ReviewPreview {
        return previewReview(target as never, now);
    }
}

import { FsrsRating } from "@guesant/saberes-domain";
import { fsrs, Rating } from "ts-fsrs";
import { reviveReviewCard, type ReviewDateFactory } from "./revive-review-card.function";
import type { FsrsReviewTarget } from "./fsrs-review-target.interface";

const ratings = {
  [FsrsRating.Again]: Rating.Again,
  [FsrsRating.Hard]: Rating.Hard,
  [FsrsRating.Good]: Rating.Good,
  [FsrsRating.Easy]: Rating.Easy,
} as const;

export type PreviewReviewOptions = {
  now: Date;
  createDate: ReviewDateFactory;
  requestRetention: number;
};

export function previewReview(target: FsrsReviewTarget, options: PreviewReviewOptions) {
  const { now, createDate } = options;

  const scheduler = fsrs({
    request_retention: options.requestRetention,
    enable_fuzz: false,
  });

  const result = scheduler.repeat(reviveReviewCard(target.fsrsCard, now, createDate), now);

  return Object.fromEntries(
    (Object.values(FsrsRating) as FsrsRating[]).map((rating) => {
      return [
        rating,
        {
          dueAt: result[ratings[rating]].card.due.toISOString(),
          interval: result[ratings[rating]].card.due.getTime() - now.getTime(),
        },
      ];
    }),
  );
}

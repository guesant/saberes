import { FsrsRating, type ReviewTargetRecord } from "@guesant/saberes-domain";
import { fsrs, Rating } from "ts-fsrs";
import { reviveReviewCard, type ReviewDateFactory } from "./revive-review-card.function.ts";
import type { StoredReviewCard } from "./stored-review-card.type.ts";

const scheduler = fsrs({ request_retention: 0.9, enable_fuzz: false });

const ratings = {
  [FsrsRating.Again]: Rating.Again,
  [FsrsRating.Hard]: Rating.Hard,
  [FsrsRating.Good]: Rating.Good,
  [FsrsRating.Easy]: Rating.Easy,
} as const;

export type PreviewReviewOptions = {
  now: Date;
  createDate: ReviewDateFactory;
};

export function previewReview(
  target: ReviewTargetRecord & { fsrsCard?: StoredReviewCard },
  options: PreviewReviewOptions,
) {
  const { now, createDate } = options;

  const result = scheduler.repeat(reviveReviewCard(target.fsrsCard, now, createDate), now);

  return Object.fromEntries(
    (Object.values(FsrsRating) as FsrsRating[]).map((rating) => [
      rating,
      {
        dueAt: result[ratings[rating]].card.due.toISOString(),
        interval: result[ratings[rating]].card.due.getTime() - now.getTime(),
      },
    ]),
  );
}

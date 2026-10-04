import { FsrsRating, ReviewState } from "@guesant/saberes-domain";
import { fsrs, Rating } from "ts-fsrs";
import { reviveReviewCard } from "./revive-review-card.function";
import { serializeReviewCard } from "./serialize-review-card.function";
import type { FsrsReviewTarget } from "./fsrs-review-target.interface";
import type { ScheduleReviewOptions } from "./schedule-review-options.type";

const ratings = {
  [FsrsRating.Again]: Rating.Again,
  [FsrsRating.Hard]: Rating.Hard,
  [FsrsRating.Good]: Rating.Good,
  [FsrsRating.Easy]: Rating.Easy,
} as const;

export function scheduleReview(
  target: FsrsReviewTarget,
  rating: FsrsRating,
  options: ScheduleReviewOptions,
) {
  const { now, createDate } = options;

  const scheduler = fsrs({
    request_retention: options.requestRetention,
    enable_fuzz: false,
  });

  const result = scheduler.next(
    reviveReviewCard(target.fsrsCard, now, createDate),
    now,
    ratings[rating],
  );

  let state = ReviewState.Relearning;

  if (result.card.state === 0) {
    state = ReviewState.New;
  } else if (result.card.state === 1) {
    state = ReviewState.Learning;
  } else if (result.card.state === 2) {
    state = ReviewState.Review;
  }

  return {
    ...target,
    fsrsCard: serializeReviewCard(result.card),
    dueAt: result.card.due.toISOString(),
    difficulty: result.card.difficulty,
    stability: result.card.stability,
    retrievability: scheduler.get_retrievability(result.card, now, false),
    state,
    lastReviewedAt: now.toISOString(),
    schedulerVersion: "ts-fsrs-v6",
  };
}

import { createEmptyCard, type Card } from "ts-fsrs";
import type { StoredReviewCard } from "./stored-review-card.type";

export type ReviewDateFactory = (value: string) => Date;

export function reviveReviewCard(
  card: StoredReviewCard | null | undefined,
  now: Date,
  createDate: ReviewDateFactory,
): Card {
  if (!card) {
    return createEmptyCard(now);
  }

  return {
    ...card,
    due: createDate(card.due),
    last_review: card.last_review ? createDate(card.last_review) : undefined,
  } as Card;
}

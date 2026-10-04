import type { StoredReviewCard } from "./stored-review-card.interface";
import type { Card } from "ts-fsrs";

export function serializeReviewCard(card: Card): StoredReviewCard {
  return {
    ...card,
    due: card.due.toISOString(),
    last_review: card.last_review?.toISOString() || null,
  };
}

import type { Card } from "ts-fsrs";

export interface StoredReviewCard extends Omit<Card, "due" | "last_review"> {
  due: string;
  last_review: string | null;
}

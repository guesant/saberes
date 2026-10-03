import type { Card } from "ts-fsrs";

export type StoredReviewCard = Omit<Card, "due" | "last_review"> & {
  due: string;
} & Record<"last_review", string | null>;

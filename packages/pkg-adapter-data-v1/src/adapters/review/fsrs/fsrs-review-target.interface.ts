import type { StoredReviewCard } from "./stored-review-card.interface";
import type { ReviewTargetRecord } from "@guesant/saberes-domain";

export interface FsrsReviewTarget extends ReviewTargetRecord {
  fsrsCard?: StoredReviewCard;
}

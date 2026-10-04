import { getReviewRetention } from "./get-review-retention.function";
import type { GetReviewRetentionImpactInput } from "./get-review-retention-impact-input.interface";
import type { ReviewRetentionImpact } from "./review-retention-impact.interface";

export function getReviewRetentionImpact(
  input: GetReviewRetentionImpactInput,
): ReviewRetentionImpact {
  const retention = getReviewRetention(input.retention);

  const activeReviews = input.load.due + input.load.upcoming;

  return {
    retentionPercent: Math.round(retention * 100),
    estimatedReviews: Math.ceil(activeReviews * (retention / 0.9)),
  };
}

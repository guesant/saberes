import type { RecommendationItem } from "./recommendation-item.interface";
import type { RecommendationReason } from "./recommendation-reason.type";

export interface NextRecommendationDecision {
  item: RecommendationItem | null;
  reason: RecommendationReason;
}

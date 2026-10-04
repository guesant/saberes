import type { RecommendationError } from "./recommendation-error.interface";
import type { RecommendationItem } from "./recommendation-item.interface";
import type { RecommendationMastery } from "./recommendation-mastery.interface";
import type { RecommendationPrerequisite } from "./recommendation-prerequisite.interface";

export interface RecommendationInput {
  incompleteItems?: RecommendationItem[];
  prerequisites?: RecommendationPrerequisite[];
  topicMastery?: Record<string, RecommendationMastery>;
  recentErrors?: RecommendationError[];
}

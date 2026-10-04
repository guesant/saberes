import type { RecommendationInput, RecommendationItem } from "@guesant/saberes-domain";

export interface RecommendNextPort {
  execute(input?: RecommendationInput): RecommendationItem | null;
}

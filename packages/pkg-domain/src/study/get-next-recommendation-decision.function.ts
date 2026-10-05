import { recommendNext } from "./recommend-next.function";
import type { NextRecommendationDecision } from "./next-recommendation-decision.interface";
import type { RecommendationInput } from "./recommendation-input.interface";

export function getNextRecommendationDecision(input: RecommendationInput = {}): NextRecommendationDecision {
  const item = recommendNext(input);

  if (!item) {
    return { item: null, reason: "none" };
  }

  const blocked = new Set(
    (input.prerequisites ?? [])
      .filter((prerequisite) => {
        return !prerequisite.completed;
      })
      .map((prerequisite) => {
        return String(prerequisite.topicId);
      }),
  );

  const hasRecentError = (input.recentErrors ?? []).some((error) => {
    return (error.topicIds ?? []).some((topicId) => {
      return String(topicId) === String(item.topicId);
    });
  });

  const hasWeakMastery = Object.entries(input.topicMastery ?? {})
    .some(([topicId, mastery]) => {
      return String(topicId) === String(item.topicId) && (mastery.percentage ?? 0) < 100;
    });

  if (hasRecentError && !blocked.has(String(item.topicId))) {
    return { item, reason: "recent-error" };
  }

  if (hasWeakMastery && !blocked.has(String(item.topicId))) {
    return { item, reason: "weak-mastery" };
  }

  if (!blocked.has(String(item.topicId))) {
    return { item, reason: "unblocked-item" };
  }

  return { item, reason: "fallback" };
}

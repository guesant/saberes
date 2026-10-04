import type { RecommendationInput } from "./recommendation-input.interface";

export function recommendNext(input: RecommendationInput = {}) {
  const { incompleteItems = [], prerequisites = [], topicMastery = {}, recentErrors = [] } = input;

  const blocked = new Set(
    prerequisites
      .filter((item) => {
        return !item.completed;
      })
      .map((item) => {
        return String(item.topicId);
      }),
  );

  const weakTopics = Object.entries(topicMastery)
    .sort(([, left], [, right]) => {
      return (left.percentage || 0) - (right.percentage || 0);
    })
    .map(([topicId]) => {
      return String(topicId);
    });

  const errorTopics = recentErrors.flatMap((item) => {
    return (item.topicIds || []).map(String);
  });

  return (
    incompleteItems.find((item) => {
      return !blocked.has(String(item.topicId)) && errorTopics.includes(String(item.topicId));
    }) ||
    incompleteItems.find((item) => {
      return !blocked.has(String(item.topicId)) && weakTopics.includes(String(item.topicId));
    }) ||
    incompleteItems.find((item) => {
      return !blocked.has(String(item.topicId));
    }) ||
    incompleteItems[0] ||
    null
  );
}

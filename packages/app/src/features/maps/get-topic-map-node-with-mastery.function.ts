import type { StudyRecord } from "@guesant/saberes-application";

export interface GetTopicMapNodeWithMasteryInput {
  masteryByKey: Map<string | undefined, StudyRecord>;
  node: Record<string, unknown>;
}

export function getTopicMapNodeWithMastery(
  input: GetTopicMapNodeWithMasteryInput,
): Record<string, unknown> {
  const mastery = input.masteryByKey.get(`topic:${String(input.node.curriculum_topic_id)}`) || {
    confidence: "low",
    learningState: "unseen",
    percentage: 0,
  };

  return {
    ...input.node,
    learning_state: mastery.learningState || "unseen",
    mastery_confidence: mastery.confidence || "low",
    mastery_percentage: Number(mastery.percentage || 0),
  };
}

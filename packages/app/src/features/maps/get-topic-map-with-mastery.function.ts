import { getTopicMapNodeWithMastery } from "./get-topic-map-node-with-mastery.function";
import type { StudyRecord, TopicMapReadModel } from "@guesant/saberes-application";

export interface GetTopicMapWithMasteryInput {
  data: TopicMapReadModel | null | undefined;
  mastery: StudyRecord[] | undefined;
}

export function getTopicMapWithMastery(
  input: GetTopicMapWithMasteryInput,
): TopicMapReadModel | null {
  if (!input.data) {
    return null;
  }

  const masteryByKey = new Map(
    (input.mastery || []).map((record) => {
      return [record.contentKey, record];
    }),
  );

  return {
    ...input.data,
    nodes: input.data.nodes.map((node) => {
      return getTopicMapNodeWithMastery({ masteryByKey, node });
    }),
  };
}

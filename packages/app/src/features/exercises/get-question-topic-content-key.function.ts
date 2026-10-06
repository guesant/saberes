import type { QuestionTopicReadModel } from "@guesant/saberes-application";

export function getQuestionTopicContentKey(topic: QuestionTopicReadModel): string | null {
  const topicId = topic.topic_id;

  if (typeof topicId === "string" || typeof topicId === "number") {
    return `topic:${topicId}`;
  }

  return null;
}

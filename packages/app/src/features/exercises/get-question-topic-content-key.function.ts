export function getQuestionTopicContentKey(topic: Record<string, unknown>): string | null {
  const topicId = topic.topic_id;

  if (typeof topicId === "string" || typeof topicId === "number") {
    return `topic:${topicId}`;
  }

  return null;
}

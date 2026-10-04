import type { GetTopicQueryHandler } from "../queries/get-topic.query-handler";

export type TopicServices = {
  get: GetTopicQueryHandler;
};

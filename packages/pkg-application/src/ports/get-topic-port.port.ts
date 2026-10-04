import type { TopicReadModel } from "../models/index";

export interface GetTopicPort {
  execute(slug: string): Promise<TopicReadModel | null>;
}

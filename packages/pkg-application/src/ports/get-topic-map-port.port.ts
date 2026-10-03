import type { TopicMapReadModel } from "../models/content.models.ts";

export interface GetTopicMapPort {
  execute(mapKey: string): Promise<TopicMapReadModel | null>;
}

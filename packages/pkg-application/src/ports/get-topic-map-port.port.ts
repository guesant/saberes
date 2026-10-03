import type { TopicMapReadModel } from "../models/index.ts";

export interface GetTopicMapPort {
  execute(mapKey: string): Promise<TopicMapReadModel | null>;
}

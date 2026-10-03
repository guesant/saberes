import type { TopicMapReadModel } from "../models/index";

export interface GetTopicMapPort {
  execute(mapKey: string): Promise<TopicMapReadModel | null>;
}

import type { TopicReadModel } from "../models/index";
import type { TrainingScope } from "@guesant/saberes-domain";

export interface GetTopicPort {
  execute(slug: string, scope?: TrainingScope): Promise<TopicReadModel | null>;
}

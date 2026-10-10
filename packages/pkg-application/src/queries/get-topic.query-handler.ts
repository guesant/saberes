import type { TopicReadModel } from "../models/index";
import type { GetTopicPort } from "../ports/index";
import type { TrainingScope } from "@guesant/saberes-domain";

export class GetTopicQueryHandler {
  public constructor(private readonly port: GetTopicPort) {}

  public execute(slug: string, scope?: TrainingScope): Promise<TopicReadModel | null> {
    return this.port.execute(slug, scope);
  }
}

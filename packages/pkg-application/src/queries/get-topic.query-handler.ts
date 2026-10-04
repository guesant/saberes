import type { TopicReadModel } from "../models/index";
import type { GetTopicPort } from "../ports/index";

export class GetTopicQueryHandler {
  public constructor(private readonly port: GetTopicPort) {}

  public execute(slug: string): Promise<TopicReadModel | null> {
    return this.port.execute(slug);
  }
}

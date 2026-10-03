import type { GetTopicMapPort } from "../application.ports.ts";
import type { TopicMapReadModel } from "../models/content.models.ts";

export class GetTopicMapQueryHandler {
  public constructor(private readonly port: GetTopicMapPort) {}

  public execute(mapKey: string): Promise<TopicMapReadModel | null> {
    return this.port.execute(mapKey);
  }
}

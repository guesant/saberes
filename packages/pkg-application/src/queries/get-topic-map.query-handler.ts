import type { TopicMapReadModel } from "../models/index.ts";
import type { GetTopicMapPort } from "../ports/index.ts";

export class GetTopicMapQueryHandler {
  public constructor(private readonly port: GetTopicMapPort) {}

  public execute(mapKey: string): Promise<TopicMapReadModel | null> {
    return this.port.execute(mapKey);
  }
}

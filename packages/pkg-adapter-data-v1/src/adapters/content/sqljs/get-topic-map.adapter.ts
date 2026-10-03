import { SqlJsContentRepository } from "./sql-js-content.repository";
import type { GetTopicMapPort } from "@guesant/saberes-application";

export class SqlJsGetTopicMapAdapter implements GetTopicMapPort {
  public constructor(private readonly store = new SqlJsContentRepository()) {}

  public execute(
    input: Parameters<GetTopicMapPort["execute"]>[0],
  ): ReturnType<GetTopicMapPort["execute"]> {
    return this.store.getTopicMap(input);
  }
}

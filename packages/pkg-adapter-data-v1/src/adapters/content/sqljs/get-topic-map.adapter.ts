import type { ContentRepositoryContract } from "./content-repository.contract";
import type { GetTopicMapPort } from "@guesant/saberes-application";

export class SqlJsGetTopicMapAdapter implements GetTopicMapPort {
  public constructor(private readonly store: ContentRepositoryContract) {}

  public execute(
    input: Parameters<GetTopicMapPort["execute"]>[0],
  ): ReturnType<GetTopicMapPort["execute"]> {
    return this.store.getTopicMap(input);
  }
}

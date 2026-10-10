import type { ContentRepositoryContract } from "./content-repository.contract";
import type { GetTopicPort } from "@guesant/saberes-application";

export class SqlJsGetTopicAdapter implements GetTopicPort {
  public constructor(private readonly store: ContentRepositoryContract) {}

  public execute(
    input: Parameters<GetTopicPort["execute"]>[0],
    scope?: Parameters<GetTopicPort["execute"]>[1],
  ): ReturnType<GetTopicPort["execute"]> {
    return this.store.getTopic(input, scope);
  }
}

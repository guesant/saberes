import type { ContentRepositoryContract } from "./content-repository.contract";
import type { ContentReleaseReadModel, GetContentReleasePort } from "@guesant/saberes-application";

export class SqlJsGetContentReleaseAdapter implements GetContentReleasePort {
  public constructor(private readonly store: ContentRepositoryContract) {}

  public execute(): Promise<ContentReleaseReadModel | null> {
    return this.store.getContentRelease();
  }
}

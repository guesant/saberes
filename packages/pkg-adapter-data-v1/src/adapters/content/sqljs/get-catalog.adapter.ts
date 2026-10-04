import type { ContentRepositoryContract } from "./content-repository.contract";
import type { GetCatalogPort } from "@guesant/saberes-application";

export class SqlJsGetCatalogAdapter implements GetCatalogPort {
  public constructor(private readonly store: ContentRepositoryContract) {}

  public execute(
    input: Parameters<GetCatalogPort["execute"]>[0],
  ): ReturnType<GetCatalogPort["execute"]> {
    return this.store.getCatalog(input);
  }
}

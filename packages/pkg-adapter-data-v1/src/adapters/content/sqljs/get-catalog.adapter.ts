import { SqlJsContentRepository } from "./sql-js-content.repository";
import type { GetCatalogPort } from "@guesant/saberes-application";

export class SqlJsGetCatalogAdapter implements GetCatalogPort {
  public constructor(private readonly store = new SqlJsContentRepository()) {}

  public execute(
    input: Parameters<GetCatalogPort["execute"]>[0],
  ): ReturnType<GetCatalogPort["execute"]> {
    return this.store.getCatalog(input);
  }
}

import type { SavedCatalogFilter } from "../models/index";
import type { ListSavedCatalogFiltersPort } from "../ports/index";

export class ListSavedCatalogFiltersQueryHandler {
  public constructor(private readonly port: ListSavedCatalogFiltersPort) {}

  public execute(): Promise<SavedCatalogFilter[]> {
    return this.port.execute();
  }
}

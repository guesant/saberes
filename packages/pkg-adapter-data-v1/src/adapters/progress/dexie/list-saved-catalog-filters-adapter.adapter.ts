import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { ListSavedCatalogFiltersPort } from "@guesant/saberes-application";

export class ListSavedCatalogFiltersAdapter implements ListSavedCatalogFiltersPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(): ReturnType<ListSavedCatalogFiltersPort["execute"]> {
    return this.store.listSavedCatalogFilters();
  }
}

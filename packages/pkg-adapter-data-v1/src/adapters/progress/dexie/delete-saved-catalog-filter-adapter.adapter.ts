import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { DeleteSavedCatalogFilterPort } from "@guesant/saberes-application";

export class DeleteSavedCatalogFilterAdapter implements DeleteSavedCatalogFilterPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(id: string): ReturnType<DeleteSavedCatalogFilterPort["execute"]> {
    return this.store.deleteSavedCatalogFilter(id);
  }
}

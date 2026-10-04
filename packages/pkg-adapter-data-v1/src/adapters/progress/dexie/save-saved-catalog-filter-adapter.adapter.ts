import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { SaveSavedCatalogFilterPort } from "@guesant/saberes-application";

export class SaveSavedCatalogFilterAdapter implements SaveSavedCatalogFilterPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(
    input: Parameters<SaveSavedCatalogFilterPort["execute"]>[0],
  ): ReturnType<SaveSavedCatalogFilterPort["execute"]> {
    return this.store.saveSavedCatalogFilter(input);
  }
}

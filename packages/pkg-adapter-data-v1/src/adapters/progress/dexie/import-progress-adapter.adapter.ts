import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { ImportProgressPort } from "@guesant/saberes-application";

export class ImportProgressAdapter implements ImportProgressPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(input: string): ReturnType<ImportProgressPort["execute"]> {
    return this.store.importProgress(input);
  }
}

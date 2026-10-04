import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { ImportProgressInput, ImportProgressPort } from "@guesant/saberes-application";

export class ImportProgressAdapter implements ImportProgressPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(input: ImportProgressInput): ReturnType<ImportProgressPort["execute"]> {
    return this.store.importProgress(input);
  }
}

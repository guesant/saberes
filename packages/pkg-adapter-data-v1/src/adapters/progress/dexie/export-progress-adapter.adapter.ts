import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { ExportProgressPort } from "@guesant/saberes-application";

export class ExportProgressAdapter implements ExportProgressPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(): ReturnType<ExportProgressPort["execute"]> {
    return this.store.exportProgress();
  }
}

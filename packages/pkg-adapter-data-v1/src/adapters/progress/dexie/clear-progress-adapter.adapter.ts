import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { ClearProgressPort } from "@guesant/saberes-application";

export class ClearProgressAdapter implements ClearProgressPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(): ReturnType<ClearProgressPort["execute"]> {
    return this.store.clear();
  }
}

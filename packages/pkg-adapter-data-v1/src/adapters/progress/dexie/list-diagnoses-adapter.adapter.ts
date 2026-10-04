import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { ListDiagnosesPort } from "@guesant/saberes-application";

export class ListDiagnosesAdapter implements ListDiagnosesPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(): ReturnType<ListDiagnosesPort["execute"]> {
    return this.store.listDiagnoses();
  }
}

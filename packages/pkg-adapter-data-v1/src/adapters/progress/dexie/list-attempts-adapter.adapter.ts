import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { ListAttemptsPort } from "@guesant/saberes-application";

export class ListAttemptsAdapter implements ListAttemptsPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(): ReturnType<ListAttemptsPort["execute"]> {
    return this.store.listAttempts();
  }
}

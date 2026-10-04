import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { ListEnrollmentsPort } from "@guesant/saberes-application";

export class ListEnrollmentsAdapter implements ListEnrollmentsPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(): ReturnType<ListEnrollmentsPort["execute"]> {
    return this.store.listEnrollments();
  }
}

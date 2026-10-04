import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { ListReviewTargetsPort } from "@guesant/saberes-application";

export class ListReviewTargetsAdapter implements ListReviewTargetsPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(): ReturnType<ListReviewTargetsPort["execute"]> {
    return this.store.listReviewTargets();
  }
}

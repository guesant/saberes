import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { ListReviewItemsPort } from "@guesant/saberes-application";

export class ListReviewItemsAdapter implements ListReviewItemsPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(): ReturnType<ListReviewItemsPort["execute"]> {
    return this.store.listReviewItems();
  }
}

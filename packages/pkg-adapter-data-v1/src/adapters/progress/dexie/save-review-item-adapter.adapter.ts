import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { SaveReviewItemPort } from "@guesant/saberes-application";

export class SaveReviewItemAdapter implements SaveReviewItemPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(
    input: Parameters<SaveReviewItemPort["execute"]>[0],
  ): ReturnType<SaveReviewItemPort["execute"]> {
    return this.store.saveReviewItem(input.contentKey, input.data);
  }
}

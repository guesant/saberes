import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { SaveReviewTargetPort } from "@guesant/saberes-application";

export class SaveReviewTargetAdapter implements SaveReviewTargetPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(
    input: Parameters<SaveReviewTargetPort["execute"]>[0],
  ): ReturnType<SaveReviewTargetPort["execute"]> {
    return this.store.saveReviewTarget(input.contentKey, input.data);
  }
}

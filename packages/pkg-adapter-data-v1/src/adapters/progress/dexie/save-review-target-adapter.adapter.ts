import { DexieProgressStore } from "./dexie-progress.store";
import type { SaveReviewTargetPort } from "@guesant/saberes-application";

export class SaveReviewTargetAdapter implements SaveReviewTargetPort {
  public constructor(private readonly store: DexieProgressStore) {}

  public execute(
    input: Parameters<SaveReviewTargetPort["execute"]>[0],
  ): ReturnType<SaveReviewTargetPort["execute"]> {
    return this.store.saveReviewTarget(input.contentKey, input.data);
  }
}

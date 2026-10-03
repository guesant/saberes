import { DexieProgressStore } from "./dexie-progress.store";
import type { ListReviewTargetsPort } from "@guesant/saberes-application";

export class ListReviewTargetsAdapter implements ListReviewTargetsPort {
  public constructor(private readonly store: DexieProgressStore) {}

  public execute(): ReturnType<ListReviewTargetsPort["execute"]> {
    return this.store.listReviewTargets();
  }
}

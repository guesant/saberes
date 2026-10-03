import { DexieProgressStore } from "./dexie-progress.store";
import type { ListReviewItemsPort } from "@guesant/saberes-application";

export class ListReviewItemsAdapter implements ListReviewItemsPort {
  public constructor(private readonly store: DexieProgressStore) {}

  public execute(): ReturnType<ListReviewItemsPort["execute"]> {
    return this.store.listReviewItems();
  }
}

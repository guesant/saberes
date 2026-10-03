import { DexieProgressStore } from "./dexie-progress.store";
import type { SaveBookmarkPort } from "@guesant/saberes-application";

export class SaveBookmarkAdapter implements SaveBookmarkPort {
  public constructor(private readonly store: DexieProgressStore) {}

  public execute(
    input: Parameters<SaveBookmarkPort["execute"]>[0],
  ): ReturnType<SaveBookmarkPort["execute"]> {
    return this.store.saveBookmark(input.contentKey, input.data);
  }
}

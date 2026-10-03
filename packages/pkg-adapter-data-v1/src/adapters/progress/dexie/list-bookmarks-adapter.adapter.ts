import { DexieProgressStore } from "./dexie-progress.store";
import type { ListBookmarksPort } from "@guesant/saberes-application";

export class ListBookmarksAdapter implements ListBookmarksPort {
  public constructor(private readonly store: DexieProgressStore) {}

  public execute(): ReturnType<ListBookmarksPort["execute"]> {
    return this.store.listBookmarks();
  }
}

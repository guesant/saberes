import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { ListBookmarksPort } from "@guesant/saberes-application";

export class ListBookmarksAdapter implements ListBookmarksPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(): ReturnType<ListBookmarksPort["execute"]> {
    return this.store.listBookmarks();
  }
}

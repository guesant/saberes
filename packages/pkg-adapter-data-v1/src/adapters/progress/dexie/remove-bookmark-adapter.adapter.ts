import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { RemoveBookmarkPort } from "@guesant/saberes-application";

export class RemoveBookmarkAdapter implements RemoveBookmarkPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(contentKey: string): Promise<void> {
    return this.store.removeBookmark(contentKey);
  }
}

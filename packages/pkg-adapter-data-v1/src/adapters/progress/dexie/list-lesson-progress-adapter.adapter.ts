import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { ListLessonProgressPort } from "@guesant/saberes-application";

export class ListLessonProgressAdapter implements ListLessonProgressPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(): ReturnType<ListLessonProgressPort["execute"]> {
    return this.store.listLessonProgress();
  }
}

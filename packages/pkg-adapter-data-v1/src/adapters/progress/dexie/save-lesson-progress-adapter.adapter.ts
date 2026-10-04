import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { SaveLessonProgressPort } from "@guesant/saberes-application";

export class SaveLessonProgressAdapter implements SaveLessonProgressPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(
    input: Parameters<SaveLessonProgressPort["execute"]>[0],
  ): ReturnType<SaveLessonProgressPort["execute"]> {
    return this.store.saveLessonProgress(input.contentKey, input.data);
  }
}

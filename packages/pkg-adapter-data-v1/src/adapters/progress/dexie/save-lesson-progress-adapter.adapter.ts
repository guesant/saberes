import { DexieProgressStore } from "./dexie-progress.store";
import type { SaveLessonProgressPort } from "@guesant/saberes-application";

export class SaveLessonProgressAdapter implements SaveLessonProgressPort {
  public constructor(private readonly store: DexieProgressStore) {}

  public execute(
    input: Parameters<SaveLessonProgressPort["execute"]>[0],
  ): ReturnType<SaveLessonProgressPort["execute"]> {
    return this.store.saveLessonProgress(input.contentKey, input.data);
  }
}

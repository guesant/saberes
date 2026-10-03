import { DexieProgressStore } from "./dexie-progress.store";
import type { ListLessonProgressPort } from "@guesant/saberes-application";

export class ListLessonProgressAdapter implements ListLessonProgressPort {
  public constructor(private readonly store: DexieProgressStore) {}

  public execute(): ReturnType<ListLessonProgressPort["execute"]> {
    return this.store.listLessonProgress();
  }
}

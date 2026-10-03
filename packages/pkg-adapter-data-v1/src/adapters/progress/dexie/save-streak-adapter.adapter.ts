import { DexieProgressStore } from "./dexie-progress.store";
import type { SaveStreakPort } from "@guesant/saberes-application";

export class SaveStreakAdapter implements SaveStreakPort {
  public constructor(private readonly store: DexieProgressStore) {}

  public execute(
    input: Parameters<SaveStreakPort["execute"]>[0],
  ): ReturnType<SaveStreakPort["execute"]> {
    return this.store.saveStreak(input);
  }
}

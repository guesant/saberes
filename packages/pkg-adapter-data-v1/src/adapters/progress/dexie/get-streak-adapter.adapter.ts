import { DexieProgressStore } from "./dexie-progress.store";
import type { GetStreakPort } from "@guesant/saberes-application";

export class GetStreakAdapter implements GetStreakPort {
  public constructor(private readonly store: DexieProgressStore) {}

  public execute(): ReturnType<GetStreakPort["execute"]> {
    return this.store.getStreak();
  }
}

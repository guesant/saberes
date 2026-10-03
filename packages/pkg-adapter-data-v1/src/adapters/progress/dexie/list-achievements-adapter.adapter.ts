import { DexieProgressStore } from "./dexie-progress.store";
import type { ListAchievementsPort } from "@guesant/saberes-application";

export class ListAchievementsAdapter implements ListAchievementsPort {
  public constructor(private readonly store: DexieProgressStore) {}

  public execute(): ReturnType<ListAchievementsPort["execute"]> {
    return this.store.listAchievements();
  }
}

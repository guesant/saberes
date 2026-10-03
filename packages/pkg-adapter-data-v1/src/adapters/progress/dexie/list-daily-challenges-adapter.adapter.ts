import { DexieProgressStore } from "./dexie-progress.store";
import type { ListDailyChallengesPort } from "@guesant/saberes-application";

export class ListDailyChallengesAdapter implements ListDailyChallengesPort {
  public constructor(private readonly store: DexieProgressStore) {}

  public execute(): ReturnType<ListDailyChallengesPort["execute"]> {
    return this.store.listDailyChallenges();
  }
}

import { DexieProgressStore } from "./dexie-progress.store";
import type { ListTopicMasteryPort } from "@guesant/saberes-application";

export class ListTopicMasteryAdapter implements ListTopicMasteryPort {
  public constructor(private readonly store: DexieProgressStore) {}

  public execute(): ReturnType<ListTopicMasteryPort["execute"]> {
    return this.store.listTopicMastery();
  }
}

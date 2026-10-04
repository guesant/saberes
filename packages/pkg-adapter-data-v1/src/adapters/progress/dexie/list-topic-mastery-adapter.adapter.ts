import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { ListTopicMasteryPort } from "@guesant/saberes-application";

export class ListTopicMasteryAdapter implements ListTopicMasteryPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(): ReturnType<ListTopicMasteryPort["execute"]> {
    return this.store.listTopicMastery();
  }
}

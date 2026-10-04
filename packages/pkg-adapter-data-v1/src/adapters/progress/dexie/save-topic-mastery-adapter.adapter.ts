import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { SaveTopicMasteryPort } from "@guesant/saberes-application";

export class SaveTopicMasteryAdapter implements SaveTopicMasteryPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(
    input: Parameters<SaveTopicMasteryPort["execute"]>[0],
  ): ReturnType<SaveTopicMasteryPort["execute"]> {
    return this.store.saveTopicMastery(input.contentKey, input.data);
  }
}

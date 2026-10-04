import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { SaveAttemptPort } from "@guesant/saberes-application";

export class SaveAttemptAdapter implements SaveAttemptPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(
    input: Parameters<SaveAttemptPort["execute"]>[0],
  ): ReturnType<SaveAttemptPort["execute"]> {
    return this.store.saveAttempt(input);
  }
}

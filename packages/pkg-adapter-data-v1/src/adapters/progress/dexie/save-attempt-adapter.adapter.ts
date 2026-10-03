import { DexieProgressStore } from "./dexie-progress.store";
import type { SaveAttemptPort } from "@guesant/saberes-application";

export class SaveAttemptAdapter implements SaveAttemptPort {
  public constructor(private readonly store: DexieProgressStore) {}

  public execute(
    input: Parameters<SaveAttemptPort["execute"]>[0],
  ): ReturnType<SaveAttemptPort["execute"]> {
    return this.store.saveAttempt(input);
  }
}

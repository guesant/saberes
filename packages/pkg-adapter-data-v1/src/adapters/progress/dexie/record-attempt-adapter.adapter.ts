import { DexieProgressStore } from "./dexie-progress.store";
import type { RecordAttemptPort } from "@guesant/saberes-application";

export class RecordAttemptAdapter implements RecordAttemptPort {
  public constructor(private readonly store: DexieProgressStore) {}

  public execute(
    input: Parameters<RecordAttemptPort["execute"]>[0],
  ): ReturnType<RecordAttemptPort["execute"]> {
    return this.store.recordAttempt(input);
  }
}

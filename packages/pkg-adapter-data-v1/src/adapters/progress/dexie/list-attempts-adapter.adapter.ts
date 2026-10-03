import { DexieProgressStore } from "./dexie-progress.store";
import type { ListAttemptsPort } from "@guesant/saberes-application";

export class ListAttemptsAdapter implements ListAttemptsPort {
  public constructor(private readonly store: DexieProgressStore) {}

  public execute(): ReturnType<ListAttemptsPort["execute"]> {
    return this.store.listAttempts();
  }
}

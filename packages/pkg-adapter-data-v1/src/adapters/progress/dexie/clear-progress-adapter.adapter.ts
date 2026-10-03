import { DexieProgressStore } from "./dexie-progress.store";
import type { ClearProgressPort } from "@guesant/saberes-application";

export class ClearProgressAdapter implements ClearProgressPort {
  public constructor(private readonly store: DexieProgressStore) {}

  public execute(): ReturnType<ClearProgressPort["execute"]> {
    return this.store.clear();
  }
}

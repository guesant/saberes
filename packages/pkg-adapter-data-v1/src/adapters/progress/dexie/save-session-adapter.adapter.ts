import { DexieProgressStore } from "./dexie-progress.store";
import type { SaveSessionPort } from "@guesant/saberes-application";

export class SaveSessionAdapter implements SaveSessionPort {
  public constructor(private readonly store: DexieProgressStore) {}

  public async execute(input: Parameters<SaveSessionPort["execute"]>[0]): Promise<void> {
    await this.store.saveSession(input);
  }
}

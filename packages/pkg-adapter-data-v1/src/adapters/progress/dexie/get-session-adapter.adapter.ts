import { DexieProgressStore } from "./dexie-progress.store";
import type { GetSessionPort } from "@guesant/saberes-application";

export class GetSessionAdapter implements GetSessionPort {
  public constructor(private readonly store: DexieProgressStore) {}

  public execute(
    input: Parameters<GetSessionPort["execute"]>[0],
  ): ReturnType<GetSessionPort["execute"]> {
    return this.store.getSession(input);
  }
}
